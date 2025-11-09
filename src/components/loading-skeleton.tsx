'use client';

import { Card, CardBody } from '@material-tailwind/react';

interface SkeletonProps {
  className?: string;
}

export function SkeletonLine({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded h-4 ${className}`}></div>
  );
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-full ${className}`}></div>
  );
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <Card className={className}>
      <CardBody>
        <SkeletonCircle className="w-12 h-12 mb-4" />
        <SkeletonLine className="w-3/4 mb-2" />
        <SkeletonLine className="w-1/2" />
      </CardBody>
    </Card>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <SkeletonCircle className="w-8 h-8 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-5/6" />
        <SkeletonLine className="w-4/6" />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      <ChatMessageSkeleton />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <SkeletonLine className="w-1/4" />
          <SkeletonLine className="w-1/4" />
          <SkeletonLine className="w-1/4" />
          <SkeletonLine className="w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function LoadingSkeleton({ type = 'default' }: { type?: 'default' | 'chat' | 'table' | 'cards' }) {
  switch (type) {
    case 'chat':
      return <ChatSkeleton />;
    case 'table':
      return <TableSkeleton />;
    case 'cards':
      return <CardGridSkeleton />;
    default:
      return (
        <div className="space-y-4">
          <SkeletonLine className="w-3/4" />
          <SkeletonLine className="w-1/2" />
          <SkeletonLine className="w-5/6" />
        </div>
      );
  }
}

