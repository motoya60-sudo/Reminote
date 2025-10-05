import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "ホーム" , headerShown: false }} />
      <Tabs.Screen name="diariesView" options={{ title: "日記一覧" , headerShown: false }} />
      <Tabs.Screen name="studiesView" options={{ title: "勉強記録一覧" , headerShown: false }} />

    </Tabs>
  );
}