import gradio as gr
import random

messages = [
    '你好！很高兴见到你！😊',
    'Hello! Nice to meet you! 🌟',
    '嗨！一起学习吧！💪',
    'Bonjour! 学习快乐！🎉'
]

def say_hello():
    return random.choice(messages)

with gr.Blocks(title="我的个人网页") as demo:
    gr.Markdown("""
    # 👋 你好，我是肖俊杰
    
    欢迎来到我的个人网页！
    """)
    
    with gr.Row():
        with gr.Column():
            gr.Markdown("""
            ### 📝 个人信息
            
            | 项目 | 内容 |
            |------|------|
            | **姓名** | 肖俊杰 |
            | **职业** | Python 学习者 |
            | **技能** | Python, HTML, CSS |
            """)
    
    with gr.Row():
        greet_btn = gr.Button("点击打招呼", variant="primary", size="lg")
        greeting_output = gr.Textbox(label="问候语", interactive=False, lines=2)
    
    greet_btn.click(say_hello, outputs=greeting_output)

demo.launch(server_name="0.0.0.0", server_port=7860, share=True)