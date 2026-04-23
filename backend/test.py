# test.py

from openai import OpenAI
from langchain_openai import ChatOpenAI

API_KEY = "vijKecQKQWg08ReOPYtOzw"

print("=== 1. Testing OpenAI SDK ===")
try:
    client = OpenAI(api_key=API_KEY)

    models = client.models.list()
    print("✅ API key is valid.")

    print("Models available (first 5):")
    for model in models.data[:5]:
        print("-", model.id)

except Exception as e:
    print("❌ OpenAI SDK failed:", e)


print("\n=== 2. Testing LangChain OpenAI ===")
try:
    llm = ChatOpenAI(
        model="gpt-4.1-mini",  # safe default
        api_key=API_KEY
    )

    response = llm.invoke("Say hello in one short sentence.")
    print("✅ LangChain works!")
    print("Response:", response.content)

except Exception as e:
    print("❌ LangChain failed:", e)


print("\n=== 3. Checking Versions ===")
try:
    import langchain
    import langchain_core
    import langchain_openai
    import openai

    print("langchain:", getattr(langchain, "__version__", "unknown"))
    print("langchain_core:", getattr(langchain_core, "__version__", "unknown"))
    print("langchain_openai:", getattr(langchain_openai, "__version__", "unknown"))
    print("openai:", getattr(openai, "__version__", "unknown"))

except Exception as e:
    print("❌ Version check failed:", e)