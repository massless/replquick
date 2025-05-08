import React from "react";
import { createPortal } from "react-dom";
import "./ExamplesPopover.css";
import { useIsMobile } from "../hooks/useIsMobile";

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
    id: "music-library",
    title: "Music Library",
    description: "A sample music library with albums and artists",
    icon: "🎵",
    code: `musicLibrary = {
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
};
musicLibrary;`,
  },
  {
    id: "math-equations",
    title: "Math Equations",
    description: "Common mathematical functions",
    icon: "🔢",
    code: `myth = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  power: (base, exponent) => Math.pow(base, exponent),
  squareRoot: (num) => Math.sqrt(num)
};
myth.squareRoot(4096);`,
  },
  {
    id: "submarine",
    title: "Submarine Class",
    description: "A class representing a submarine",
    icon: "🚢",
    code: `let Submarine;
if (!Submarine) {
  Submarine = class {
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
}

nautilus = new Submarine('Nautilus', 1000);
nautilus.dive(500);
nautilus;`,
  },
  {
    id: "todo-list",
    title: "Todo List",
    description: "A simple todo list implementation",
    icon: "📝",
    code: `let TodoList;
if (!TodoList) {
    TodoList = class {
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
  }

myTodos = new TodoList();
myTodos.addTodo('Learn JavaScript');
myTodos.addTodo('Build something cool');
myTodos;`,
  },
];

export function ExamplesPopover({
  onClose,
  onSelect,
  triggerRect,
}: ExamplesPopoverProps) {
  if (!triggerRect) return null;

  const isMobile = useIsMobile();

  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
  };

  const portalRoot = document.getElementById("portal-root") || document.body;

  // Add ESC key handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="examples-popover"
      style={{
        top: triggerRect.bottom + window.scrollY + 8,
        left: isMobile ? 20 : triggerRect.left + window.scrollX,
      }}
    >
      <div className="examples-header">
        <h3>Code Examples</h3>
        <button onClick={onClose} className="close-button">
          <svg
            fill="currentColor"
            strokeWidth="0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
          >
            <path
              fillRule="evenodd"
              d="m7.116 8-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
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
    </div>,
    portalRoot
  );
}
