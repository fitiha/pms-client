"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

type Project = {
  status: string;
  startDate: string;
}

type OverviewProps = {
  projects: Project[];
}

export function Overview({ projects }: OverviewProps) {
  const currentDate = new Date();
  const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);

  const data = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthProjects = projects.filter(project => {
      const projectDate = new Date(project.startDate);
      return projectDate.getMonth() === date.getMonth() && projectDate.getFullYear() === date.getFullYear();
    });
    return {
      name: date.toLocaleString('default', { month: 'short' }),
      total: monthProjects.length,
      active: monthProjects.filter(project => project.status === 'IN_PROGRESS').length,
    };
  }).reverse();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
        <Bar dataKey="active" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary-foreground" />
      </BarChart>
    </ResponsiveContainer>
  )
}

