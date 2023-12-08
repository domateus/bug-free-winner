"use client"
import React from 'react'

import {useState} from "react";

const parseRules = (rules: string) => {
  const lines = rules.split('\n')
  const grammar: {[key: string]: string[]} = {}
  for (const line of lines) {
    const [key, values] = line.split('->')
    grammar[key.trim()] = values.trim().split("|").map(v => v.trim())
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
  return {result, message: result ? pathTaken.reverse().join(" -> ") : rejection}
}

export default function Home() {
  const [rules, setRules] = useState('')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{result: boolean; message: string}>()
 
  return (
    <div className="flex h-screen w-full bg-zinc-800 flex justify-center caret-black">
      <div className="w-1/2 h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Regras da gramática</h2>
        <div className="space-y-4">
          <div className="mb-4">
            <textarea className="w-full rounded-md text-black caret-black border-transparent focus:border-transparent focus:ring-0 p-2" id="rules" rows={6} placeholder="E.g  . S -> aS|bA" onChange={e => setRules(e.target.value)} value={rules} />
          </div>
          <h2 className="text-2xl font-bold mb-4">String de entrada</h2>
          <input className="w-full caret-black text-black" type="text" placeholder="E.g: 001101001" onChange={e => setInput(e.target.value)} value={input} />
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
     
    </div>
  )
}