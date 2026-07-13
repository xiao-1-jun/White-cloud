import urllib.request
import json
import base64

TOKEN = ""
REPO = "xiao-1-jun"
REPO_NAME = "White-cloud"
BRANCH = "main"

def upload_file(filepath, content):
    url = f"https://api.github.com/repos/{REPO}/{REPO_NAME}/contents/{filepath}"
    encoded_content = base64.b64encode(content.encode("utf-8")).decode("utf-8")
    
    data = {
        "message": f"add {filepath}",
        "content": encoded_content,
        "branch": BRANCH
    }
    
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {TOKEN}",
        "Content-Type": "application/json"
    }, data=json.dumps(data).encode())
    
    try:
        r = urllib.request.urlopen(req)
        result = json.loads(r.read())
        print(f"✅ {filepath}: {result['content']['path']}")
        return True
    except urllib.error.HTTPError as e:
        print(f"❌ {filepath}: HTTP {e.code}")
        try:
            print(f"   Response: {e.read()[:300]}")
        except:
            pass
        return False

def main():
    files_to_upload = {
        "index.html": "",
        "learning_basics.py": "",
        "deploy_web.py": "",
        ".gitignore": ""
    }
    
    print("读取文件...")
    for filepath in files_to_upload:
        with open(filepath, "r", encoding="utf-8") as f:
            files_to_upload[filepath] = f.read()
        print(f"  {filepath}: {len(files_to_upload[filepath])} bytes")
    
    print("\n上传文件...")
    for filepath, content in files_to_upload.items():
        success = upload_file(filepath, content)
    
    print(f"\n完成！")
    print(f"仓库地址: https://github.com/{REPO}/{REPO_NAME}")

if __name__ == "__main__":
    main()