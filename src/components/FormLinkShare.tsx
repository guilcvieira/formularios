'use client';
import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImShare } from 'react-icons/im';
import { toast } from 'sonner';

export default function FormLinkShare({ shareUrl }: { shareUrl: string }) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sharelink = `${window.location.origin}/submit/${shareUrl}`;

  return (
    <div className="flex flex-grow items-center gap-2">
      <Input value={sharelink} readOnly />
      <Button
        className="w-[250px]"
        onClick={() => {
          navigator.clipboard.writeText(sharelink);
          toast('Copied', {
            description: 'Link copied to clipboard!',
          });
        }}
      >
        <ImShare className="size-4" />
        Share Link
      </Button>
    </div>
  );
}
