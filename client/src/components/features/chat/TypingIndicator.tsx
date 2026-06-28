export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[85%]">
      <div className="h-8 w-8 shrink-0 rounded-full bg-sage-50 border border-sage-100 flex items-center justify-center">
        <span className="text-xs font-medium text-sage-700">B</span>
      </div>
      <div className="bg-sage-50 border border-sage-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
