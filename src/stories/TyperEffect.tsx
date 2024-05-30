import React, { useEffect, useRef, useState } from "react";
import malarkey from "malarkey";
import "./typer.css";

const newTyper = (element: Element) => {
  const callback = (text: string | null) => {
    if (element) {
      element.textContent = text;
    }
  };

  return malarkey(callback, {
    typeSpeed: 100,
    deleteSpeed: 50,
    pauseDuration: 2000,
    repeat: false,
  });
};
export const TyperEffect = (props: { words: string[] }) => {
  const [typer, setTyper] = useState<{ type: (text: string) => void } | null>(
    null,
  );
  const [text, setText] = useState(" ");
  const { words } = props;
  const indexRef = useRef(0); // 使用 useRef 来存储索引

  useEffect(() => {
    const element = document.querySelector(".typewriter");
    if (element) {
      const typerInstance = newTyper(element);
      setTyper(typerInstance);
    }
  }, []);

  useEffect(() => {
    if (typer) {
      typer.type(text);
    }
  }, [text, typer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typer && words[indexRef.current]) {
        setText(words[indexRef.current]); // 使用 indexRef.current 作为索引
        indexRef.current = (indexRef.current + 1) % words.length; // 更新 indexRef.current
      }
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [typer, words]);

  return <div className={"typewriter"}></div>;
};
