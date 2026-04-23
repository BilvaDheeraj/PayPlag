import asyncio
from duckduckgo_search import AsyncDDGS

async def test():
    async with AsyncDDGS() as ddgs:
        res = await ddgs.text("test", max_results=2)
        print(res)

asyncio.run(test())
