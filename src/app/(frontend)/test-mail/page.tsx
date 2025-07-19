// src/app/test-mail/page.tsx

import SendTestMailForm from "./SendTestMailForm";


export default function Page() {
  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-semibold mb-4">Amazon SES Test Mail</h1>
      <SendTestMailForm />
    </main>
  );
}
