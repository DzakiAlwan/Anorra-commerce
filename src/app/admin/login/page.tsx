import React from 'react';
import { loginAction } from '@/server/actions/auth';

export default function AdminLoginPage() {
  const [state, formAction] = React.useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <form className="mt-8 space-y-6" action={formAction}>
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
              {state.error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
