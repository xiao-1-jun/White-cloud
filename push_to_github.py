import os
import sys
import urllib.request
import urllib.parse
import json

TOKEN = ""
REPO = "xiao-1-jun/-"
BRANCH = "main"

def get_latest_commit():
    url = f"https://api.github.com/repos/{REPO}/git/refs/heads/{BRANCH}"
    req = urllib.request.Request(url, headers={"Authorization": f"token {TOKEN}"})
    try:
        r = urllib.request.urlopen(req)
        data = json.loads(r.read())
        return data["object"]["sha"]
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise

def get_tree(commit_sha):
    url = f"https://api.github.com/repos/{REPO}/git/commits/{commit_sha}"
    req = urllib.request.Request(url, headers={"Authorization": f"token {TOKEN}"})
    r = urllib.request.urlopen(req)
    data = json.loads(r.read())
    return data["tree"]["sha"]

def create_blob(content, encoding="utf-8"):
    url = f"https://api.github.com/repos/{REPO}/git/blobs"
    data = {
        "content": content,
        "encoding": encoding
    }
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {TOKEN}",
        "Content-Type": "application/json"
    }, data=json.dumps(data).encode())
    r = urllib.request.urlopen(req)
    return json.loads(r.read())["sha"]

def create_tree(base_tree_sha, files):
    url = f"https://api.github.com/repos/{REPO}/git/trees"
    tree = []
    for filepath, blob_sha in files.items():
        tree.append({
            "path": filepath,
            "mode": "100644",
            "type": "blob",
            "sha": blob_sha
        })
    data = {
        "base_tree": base_tree_sha,
        "tree": tree
    }
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {TOKEN}",
        "Content-Type": "application/json"
    }, data=json.dumps(data).encode())
    r = urllib.request.urlopen(req)
    return json.loads(r.read())["sha"]

def create_commit(tree_sha, parent_sha, message):
    url = f"https://api.github.com/repos/{REPO}/git/commits"
    data = {
        "message": message,
        "tree": tree_sha,
        "parents": [parent_sha] if parent_sha else []
    }
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {TOKEN}",
        "Content-Type": "application/json"
    }, data=json.dumps(data).encode())
    r = urllib.request.urlopen(req)
    return json.loads(r.read())["sha"]

def update_ref(commit_sha):
    url = f"https://api.github.com/repos/{REPO}/git/refs/heads/{BRANCH}"
    data = {
        "sha": commit_sha,
        "force": True
    }
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {TOKEN}",
        "Content-Type": "application/json"
    }, data=json.dumps(data).encode())
    r = urllib.request.urlopen(req)
    return r.status == 200

def main():
    files_to_upload = ["index.html", "learning_basics.py", "deploy_web.py", ".gitignore"]
    
    print("读取文件内容...")
    file_blobs = {}
    for filepath in files_to_upload:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        blob_sha = create_blob(content)
        file_blobs[filepath] = blob_sha
        print(f"  {filepath} -> {blob_sha[:10]}...")
    
    print("\n获取最新提交...")
    latest_commit = get_latest_commit()
    if latest_commit:
        print(f"  找到最新提交: {latest_commit[:10]}...")
        base_tree = get_tree(latest_commit)
        print(f"  基础树: {base_tree[:10]}...")
    else:
        print("  仓库为空，创建初始提交")
        base_tree = None
    
    print("\n创建新树...")
    if base_tree:
        new_tree = create_tree(base_tree, file_blobs)
    else:
        url = f"https://api.github.com/repos/{REPO}/git/trees"
        tree = []
        for filepath, blob_sha in file_blobs.items():
            tree.append({
                "path": filepath,
                "mode": "100644",
                "type": "blob",
                "sha": blob_sha
            })
        data = {"tree": tree}
        req = urllib.request.Request(url, headers={
            "Authorization": f"token {TOKEN}",
            "Content-Type": "application/json"
        }, data=json.dumps(data).encode())
        r = urllib.request.urlopen(req)
        new_tree = json.loads(r.read())["sha"]
    print(f"  新树: {new_tree[:10]}...")
    
    print("\n创建提交...")
    commit_sha = create_commit(new_tree, latest_commit, "上传个人网页和Python学习文件")
    print(f"  提交: {commit_sha[:10]}...")
    
    print("\n更新分支引用...")
    success = update_ref(commit_sha)
    if success:
        print("  ✅ 推送成功！")
        print(f"  仓库地址: https://github.com/{REPO}")
    else:
        print("  ❌ 推送失败！")

if __name__ == "__main__":
    main()