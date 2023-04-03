import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import { useState } from "react";
import styles from "./index.module.css";
import { marked } from 'marked';

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    console.log("submit");
    document.getElementById("submit").setAttribute("disabled", true);
    document.getElementById("submit").setAttribute("value", "请求中");

    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      // setResult(data.result.replace(/\t/g, '    '));
      let html = marked.parse(data.result);
      setResult(html);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      console.log("enabled");
      document.getElementById("submit").removeAttribute("disabled");
      document.getElementById("submit").setAttribute("value", "告诉我");
    }
  }

  async function setAlignByOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['macos','mac os','macintosh', 'macintel', 'macppc', 'mac68k'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
      platform = platform.toLowerCase();
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'MacOS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/Linux/.test(platform)) {
      os = 'Linux';
    }

    if (os=='Windows' || os=='MacOS') {
      document.getElementById("result").style.width = "30%";
    }
  }
  

  return (
    <div>
      <Head>
        <title>TRY ChatGPT</title>
        <link rel="icon" href="/dog.png" />
      </Head>
      <Script strategy="lazyOnload" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_KEY}`}></Script>
      <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
      <Script strategy="lazyOnload">
      {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
          page_path: window.location.pathname,
          });
      `}
      </Script>
      <Script>
      {`
          var textarea = document.querySelector('textarea');
          textarea.addEventListener('input', (e) => {
              textarea.style.height = '50px';
              textarea.style.height = e.target.scrollHeight + 'px';
          });
      `}
      </Script>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon}></img> */}
        <Image src="/dog.png" className={styles.icon} width={34} height={34} alt=""
          onLoadingComplete={() => { 
            alert("更新了调用ChatGPT的接口版本(gpt-3.5-turbo)，提高了响应速度和内容准确性\n除了暂不支持上下文，与官网体验一致\n问题+回答长度限制约200汉字/400英文单词\n欢迎推荐本站给其他朋友\n反馈与建议vx:ihtsan"); 
            setAlignByOS();
        }} />
          {/* onLoadingComplete={() => alert("本站纯私人免费共享账号,影响到某些利益集团盈利,被攻击快速消耗完了调用ChatGPT的请求quota.\n恢复时间未知,请持续关注本站\n交流加我vx:ihtsan")} /> */}
        <h3>TRY ChatGPT</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="animal"
            placeholder="Enter your question"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input id="submit" type="submit" value="告诉我" />
        </form>
        <div id="result" className={styles.result} width="80%" dangerouslySetInnerHTML={{__html: result}}></div>
      </main>
    </div>
  );
}
