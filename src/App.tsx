import React, { FunctionComponent, useEffect } from "react";
import useObject from "useobject";
import axios from "axios";
import Fit from "react-fit";
import PieChart from "./components/pie";

const App: FunctionComponent = () => {
  const req = axios.create({ baseURL: "https://api.github.com/users/" });

  const { state, setState } = useObject({
    result: [] as { type: string; count: number }[],
    input: "",
    visible: ""
  });

  const fetch = async (user: string) => {
    let ress: any[] = [];
    for (let i = 0; ; i++) {
      const res = await req
        .get(user + "/repos?per_page=100&page=" + i)
        .catch(console.log);
      if (!res) break;
      if ((res as any).data.length === 0) break;
      ress.push((res as any).data);
    }
    if (ress.length === 0) return;
    const res = ress.flatMap(item => item);

    const languages = res.flatMap(item => {
      if (item.language) {
        return [item.language];
      } else {
        return [];
      }
    });

    const results: { type: string; count: number }[] = [];
    const map: { [key: string]: number } = {};
    languages.forEach(lang => {
      if (Object.keys(map).includes(lang)) {
        map[lang]++;
      } else {
        map[lang] = 1;
      }
    });
    Object.keys(map).map(key => results.push({ type: key, count: map[key] }));
    setState({
      result: results
    });
  };

  return (
    <div>
      <input
        placeholder="user name"
        onChange={e => setState({ input: e.target.value })}
        value={state.input}
      />
      <button
        onClick={() => {
          fetch(state.input);
          setState({ visible: state.input, input: "" });
        }}
      >
        show
      </button>
      <p style={{ fontSize: 20 }}>{state.visible}</p>
      {state.result.length > 0 && (
        <div style={{ display: "flex" }}>
          <div style={{ width: "20vw" }}>
            {state.result
              .sort((a, b) => b.count - a.count)
              .map(item => (
                <p key={item.type}>
                  {item.type}:{item.count}
                </p>
              ))}
          </div>
          <div
            style={{
              width: "80vw",
              maxWidth: "80vh",
              height: "80vw",
              maxHeight: "80vh"
            }}
          >
            <Fit
              target={(a, b) => (
                <PieChart data={state.result} width={a} height={b} />
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
