'use client'
import { v4 } from 'uuid';
import React, { useEffect, useState } from 'react'

interface GrammarItem {
  [key: string]: string[];
}

interface StorageItem {
  id: string;
  grammar: GrammarItem;
  input: string;
  isAccepted: boolean;
  pathTaken: string[];
  rejection: string;
  date: Date;
}

const parseRules = (rules: string) => {
  const lines = rules.split('\n')
  const grammar: {[key: string]: string[]} = {}
  for (const line of lines) {
    const [key, values] = line.split('->')
    grammar[key.trim()] = values?.trim().split("|").map(v => v.trim())
  }
  return grammar
}

const simulate = (grammar: {[key: string]: string[]}, input: string) => {
  if (input.length === 0) return {result: false, message: "Input vazio"}
  const pathTaken: string[] = []
  let rejection = ""
  const acceptNext = (currentState: string, input: string): boolean => {
    const transitions = grammar[currentState]
    let accept = false
    const char = input[0]
    const anyTransition = transitions.find(t => t.startsWith(char))
    if (input.length === 1) {
      accept = !!anyTransition && anyTransition === char
      if (accept) {
        pathTaken.push(anyTransition!)
      } else {
        if (!anyTransition) {
          rejection = `Sem regra para ${currentState}(${char})`
        } else {
          rejection = `Transição ${currentState}(${char}) -> ${anyTransition[1]} não termina em estado de aceitação`
        }
      }
      return accept
    } else {
      if (!anyTransition) {
        rejection = `Sem regra para ${currentState}(${char})`
      }
    }
    if (transitions) {
      console.log("State: ", currentState, "Input: ", input, transitions)
      for (const rule of transitions) {
        if (rule.length > 1 && char === rule[0]) {
          console.log("Rule: ", rule)
          accept = accept || acceptNext(rule[1], input.slice(1, input.length))
          if (accept) {
            pathTaken.push(rule)
          }
        } else if (char === rule) {
        
        }
      }
    }
    return accept
  }
  const result = acceptNext("S", input)
  pathTaken.push("S")

  const isAccepted = result ? "Aceito" : "Rejeitado";
  const date = new Date()
  const id = v4()
  localStorage.setItem(id, JSON.stringify({ grammar, input, isAccepted, pathTaken, rejection, date }))

  return { result, message: result ? pathTaken.reverse().join(" -> ") : rejection }
}

export default function Home() {
  const [rules, setRules] = useState('')
  const [input, setInput] = useState('')
  const [result, setResult] = useState({ result: false, message: "" })
  const [localStorageItems, setLocalStorageItems] = useState<StorageItem[]>([]);

  const loadItems = () => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const item = localStorage.getItem(key!);
        if (item) {
            items.push(JSON.parse(item));
        }
    }
    setLocalStorageItems(items);
  };

  useEffect(() => {
    loadItems();
        const handleStorageChange = () => {
            loadItems();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
  }, []);

  return (
    <div className="flex h-screen w-full bg-zinc-800 flex justify-center caret-black">
      <div className="w-1/2 h-full p-4">
        <h2 className="text-2xl font-bold mb-4">Regras da gramática</h2>
        <div className="space-y-4">
          <div className="mb-4">
            <textarea className="w-full rounded-md text-black caret-black border-transparent focus:border-transparent focus:ring-0 p-2" id="rules" rows={6} placeholder="E.g  . S -> aS|bA" onChange={e => setRules(e.target.value)} value={rules} />
          </div>
          <h1 className="text-xs mb-4">Preencher na Forma Normal de Chomsky. Letras minusculas são terminais. Não fazer uso de Épsilon</h1>
          <h2 className="text-2xl font-bold mb-4">String de entrada</h2>
          <input className="w-full caret-black text-black rounded-md" type="text" placeholder="E.g: 001101001" onChange={e => setInput(e.target.value)} value={input} />
          <button className="w-full bg-blue-500 text-white" type="submit" onClick={() => {
            const grammar = parseRules(rules)
            setResult(simulate(grammar, input))
            console.log(simulate(grammar, input))
          }}>
            Simular Autômato
          </button>
          {result && <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">Resultado</h2>
            <div className="text-xl font-bold mb-4">{result.result ? "Aceito" : "Rejeitado"}</div>
            <div className="text-xl font-bold mb-4">{result.message}</div>
          </div>}
        </div>
      </div>
      <div className="p-4 w-1/8 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Histórico</h2>
        <ul>
          {localStorageItems.map((item, index) => (
            item.date ?
              <li key={item.id} className='mx-4 mb-6 border-t border-gray-300 my-4'>
                <p className='mb-2'>Gramática: {
                  Object.entries(item.grammar).map(([key, values]) => (
                    <div key={key}>
                      <p>{key}: {values.join(', ')}</p>
                    </div>
                    ))
                  }
                </p>
                <p>Input: {item.input}</p>
                <p>Status: {item.isAccepted}</p>
                <p>Data: {new Date(item.date).toLocaleString()}</p>
              </li>
              : null
          ))}
        </ul>
      </div>
    </div>
  )
}
