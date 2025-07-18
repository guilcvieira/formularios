'use client';
import React, { useEffect } from 'react';
import { Button } from './ui/button';

export default function VisitBtn({ shareUrl }: { shareUrl: string }) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sharelink = `${window.location.origin}/submit/${shareUrl}`;

  return (
    <Button
      className="w-[200px]"
      onClick={() => {
        window.open(sharelink, '_blank');
      }}
    >
      Visit
    </Button>
  );
}
