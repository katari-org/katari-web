---
title: Quickstart
description: 5 分で動かす Katari (placeholder)。
---

以下は仮の例です。

```katari title="hello.ktr" showLineNumbers
agent ask(question: string) -> string {
  let answer = ask_ai(question);
  return answer;
}
```

実行:

```sh
katari run greet --name Katari
```
