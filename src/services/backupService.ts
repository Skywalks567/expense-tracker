import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import { Expense } from '../types/expense';

export async function exportBackupToFile(expenses: Expense[]): Promise<boolean> {
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `backup-expense-tracker-${dateStr}.json`;
  const jsonContent = JSON.stringify(expenses, null, 2);

  if (Platform.OS === 'web') {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  }

  try {
    const cacheDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
    const fileUri = `${cacheDir}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, jsonContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Simpan atau Bagikan File Cadangan',
        UTI: 'public.json',
      });
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error exporting backup file:', err);
    return false;
  }
}

export async function importBackupFromFile(): Promise<Expense[] | null> {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (res.canceled || !res.assets || res.assets.length === 0) return null;

    const file = res.assets[0];
    let fileContent = '';

    if (Platform.OS === 'web') {
      const response = await fetch(file.uri);
      fileContent = await response.text();
    } else {
      fileContent = await FileSystem.readAsStringAsync(file.uri);
    }

    const parsed = JSON.parse(fileContent);
    if (!Array.isArray(parsed)) return null;

    const valid: Expense[] = parsed.filter(
      (it: any) => it && typeof it.amount === 'number' && it.categoryId
    );
    return valid.length > 0 ? valid : null;
  } catch (err) {
    console.error('Error importing backup file:', err);
    return null;
  }
}
