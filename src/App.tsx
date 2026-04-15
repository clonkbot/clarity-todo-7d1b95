import React, { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('glassTodos');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: Todo) => ({ ...t, createdAt: new Date(t.createdAt) }));
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('glassTodos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 animate-gradient-shift" />

      {/* Floating orbs for depth */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-pink-400/40 rounded-full blur-3xl animate-float-slow" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-float-slower" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-400/20 rounded-full blur-3xl" />

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl tracking-tight mb-2">
            Clarity
          </h1>
          <p className="text-white/70 text-base md:text-lg font-light tracking-wide">
            Your thoughts, crystallized
          </p>
        </header>

        {/* Glass container */}
        <div className="w-full max-w-lg md:max-w-xl">
          {/* Input card */}
          <form onSubmit={addTodo} className="mb-6">
            <div className="glass-panel p-2 flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 bg-transparent text-white placeholder-white/50 text-base md:text-lg py-3 px-2 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 md:px-6 py-2.5 md:py-3 bg-white/25 hover:bg-white/35 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-sm md:text-base"
              >
                Add
              </button>
            </div>
          </form>

          {/* Filter tabs */}
          <div className="glass-panel p-1.5 mb-4 flex gap-1">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base capitalize transition-all duration-300 ${
                  filter === f
                    ? 'bg-white/30 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {f}
                {f === 'active' && activeCount > 0 && (
                  <span className="ml-1.5 md:ml-2 px-1.5 md:px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {activeCount}
                  </span>
                )}
                {f === 'completed' && completedCount > 0 && (
                  <span className="ml-1.5 md:ml-2 px-1.5 md:px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {completedCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Todo list */}
          <div className="glass-panel p-3 md:p-4 min-h-[300px] md:min-h-[400px]">
            {filteredTodos.length === 0 ? (
              <div className="h-[250px] md:h-[350px] flex flex-col items-center justify-center text-white/50">
                <div className="w-16 h-16 md:w-20 md:h-20 mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium">
                  {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
                </p>
                <p className="text-xs md:text-sm mt-1">
                  {filter === 'all' ? 'Add one above to get started' : 'Check back later'}
                </p>
              </div>
            ) : (
              <ul className="space-y-2 md:space-y-3">
                {filteredTodos.map((todo, index) => (
                  <li
                    key={todo.id}
                    className="group glass-item p-3 md:p-4 flex items-center gap-3 md:gap-4 animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 md:w-7 md:h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        todo.completed
                          ? 'bg-white/40 border-white/60'
                          : 'border-white/40 hover:border-white/70 hover:bg-white/10'
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <span className={`flex-1 text-base md:text-lg transition-all duration-300 break-words ${
                      todo.completed ? 'text-white/50 line-through' : 'text-white'
                    }`}>
                      {todo.text}
                    </span>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/0 hover:bg-red-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white/70 hover:text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer stats */}
          {todos.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-white/60 text-sm">
              <span>{activeCount} task{activeCount !== 1 ? 's' : ''} remaining</span>
              {completedCount > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-white/50 hover:text-white transition-colors duration-300 underline underline-offset-2"
                >
                  Clear completed ({completedCount})
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 md:py-6 text-center">
        <p className="text-white/40 text-xs tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>

      {/* Custom styles */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }

        @keyframes float-slower {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(40px) translateX(-30px); }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 1.25rem;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .glass-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 0.875rem;
          transition: all 0.3s ease;
        }

        .glass-item:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}

export default App;
