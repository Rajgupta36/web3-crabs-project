import React, { useEffect, useRef } from 'react';
import { Heir } from '../types';

interface PieChartProps {
  heirs: Heir[];
  size?: number;
}

const COLORS = [
  '#7C3AED', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
];

const PieChart: React.FC<PieChartProps> = ({ heirs, size = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || heirs.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = heirs.reduce((sum, heir) => sum + heir.percentage, 0);

    let startAngle = 0;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    heirs.forEach((heir, index) => {
      const percentage = heir.percentage / total;
      if (percentage === 0) return;

      const endAngle = startAngle + (percentage * 2 * Math.PI);
      const color = COLORS[index % COLORS.length];

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      startAngle = endAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

  }, [heirs, size]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="dark:filter dark:brightness-90"

      />
    </div>
  );
};

export default PieChart;