from langchain_openai import ChatOpenAI

key=""

promt="Hello, how are you?"
model = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    api_key=key
    

    # api_key="...",
    # base_url="...",
    # organization="...",
    # other params...
)

response = model.invoke(promt)
print(response)