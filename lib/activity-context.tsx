"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Activity {
  action: string;
  user: string;
  time: string;
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (action: string, user: string) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load activities from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem("activities");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = (action: string, user: string) => {
    const newActivity = {
      action,
      user,
      time: new Date().toLocaleString(),
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}
