import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
 
  async function onSubmit(event) {
    console.log("submit");
    document.getElementById("submit").setAttribute("disabled",true);
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
      console.log(animalInput, data.result)

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      console.log("enabled");
      document.getElementById("submit").removeAttribute("disabled");
    }
  }

  return (
    <div>
      <Head>
        <title>TRY ChatGPT</title>
        <link rel="icon" href="/dog.png" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KZ4CDZ2250"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KZ4CDZ2250');
          `}
        </Script>
      </Head>
  
      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon}></img> */}
        <Image src="/dog.png" className={styles.icon} width={34} height={34} alt="" 
          onLoadingComplete={()=>alert("受限于ChatGPT目前性能和本站服务器配置，响应时间平均约30s，请耐心等待勿重复提交 ^_^ \n欢迎反馈与建议 zhujianxyz@163.com 业余时间维护中")}/>
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
        <div className={styles.result} width="80%">{result}</div>
      </main>
    </div>
  );
}
