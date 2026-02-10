export const dynamic = 'force-dynamic';
import React from 'react';
import AuthForm from '@/components/AuthForm';

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default page;
