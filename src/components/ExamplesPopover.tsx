import React from 'react';
import './ExamplesPopover.css';

interface ExamplesPopoverProps {
  onClose: () => void;
  onSelect: (code: string) => void;
  triggerRect: DOMRect | null;
  isDarkMode: boolean;
}

interface ExampleItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  code: string;
}

const examples: ExampleItem[] = [
  {
    id: 'music-library',
    title: 'Music Library',
    description: 'A sample music library with albums and artists',
    icon: '🎵',
    code: `const musicLibrary = {
  albums: [
    {
      title: "Thriller",
      artist: "Michael Jackson",
      year: 1982,
      tracks: ["Wanna Be Startin' Somethin'", "Thriller", "Beat It"]
    },
    {
      title: "Abbey Road",
      artist: "The Beatles",
      year: 1969,
      tracks: ["Come Together", "Something", "Here Comes the Sun"]
    }
  ]
};musicLibrary;`
  },
  {
    id: 'math-equations',
    title: 'Math Equations',
    description: 'Common mathematical functions',
    icon: '🔢',
    code: `const math = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  power: (base, exponent) => Math.pow(base, exponent),
  squareRoot: (num) => Math.sqrt(num)
};math;`
  },
  {
    id: 'submarine',
    title: 'Submarine Class',
    description: 'A class representing a submarine with basic operations',
    icon: '🚢',
    code: `class Submarine {
  constructor(name, maxDepth) {
    this.name = name;
    this.maxDepth = maxDepth;
    this.currentDepth = 0;
    this.isSubmerged = false;
  }

  dive(depth) {
    if (this.currentDepth + depth > this.maxDepth) {
      throw new Error('Cannot exceed maximum depth!');
    }
    this.currentDepth += depth;
    this.isSubmerged = true;
  }

  surface() {
    this.currentDepth = 0;
    this.isSubmerged = false;
  }
}

const nautilus = new Submarine('Nautilus', 1000);
nautilus.dive(500);nautilus;`
  },
  {
    id: 'todo-list',
    title: 'Todo List',
    description: 'A simple todo list implementation',
    icon: '📝',
    code: `class TodoList {
  constructor() {
    this.todos = [];
  }

  addTodo(text) {
    this.todos.push({
      id: Date.now(),
      text,
      completed: false
    });
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}

const myTodos = new TodoList();
myTodos.addTodo('Learn JavaScript');
myTodos.addTodo('Build something cool');myTodos;`
  }
];

export function ExamplesPopover({ onClose, onSelect, triggerRect, isDarkMode }: ExamplesPopoverProps) {
  if (!triggerRect) return null;

  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
  };

  return (
    <div
      className={`examples-popover ${isDarkMode ? 'dark' : 'light'}`}
      style={{
        top: triggerRect.bottom + window.scrollY + 8,
        left: triggerRect.left + window.scrollX,
      }}
    >
      <div className="examples-header">
        <h3>Code Examples</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="examples-grid">
        {examples.map((example) => (
          <button
            key={example.id}
            className="example-item"
            onClick={() => handleSelect(example.code)}
          >
            <span className="example-icon">{example.icon}</span>
            <div className="example-content">
              <h4>{example.title}</h4>
              <p>{example.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}