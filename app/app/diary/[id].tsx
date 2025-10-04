import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { Diary } from '@/lib/types';

export default function DiaryDetail(){
    const {id} = useLocalSearchParams<{id :string}>();
    const [data, setData] = useState<Diary | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
}