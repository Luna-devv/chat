## [Placeholder Name] 
> A simple, Discord-like, chat app

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I3I6AFVAP)

I like the Discord UI for the most part, but I absolutely hate the company Discord Inc. I am not a wizard, but I think I am good enough to make *something*.

---

Currently, there are the following components:
- **`./gateway`:** A Go-lang based websocket server to handle cache updates for the web app
- **`./web`:** A TypeScript React (react router v7 + tailwind) based chat app

For internal communications, I currently use redis pub/sub, which will probably be replaced by either redis stream (using valkey) or some other Kafka-like, self-hostable, event-streaming service.

---

![chat app](https://gitlab.com/-/project/66247970/uploads/03d97de6adc78726d912ce53b60c439c/Screenshot_From_2025-02-06_20-37-25.png)

![joining a new server and UI overview](https://gitlab.com/-/project/66247970/uploads/aababa6ba1414e33b7b3bde882fe2a3f/Screencast_From_2025-02-06_20-38-07.mp4)

**All the features shown in the video actually work, are stored in a database and synchronised via the Gateway service.