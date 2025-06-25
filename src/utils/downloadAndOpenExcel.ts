import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';
import { requestStoragePermission } from './requestStoragePermission';
import { API_URL } from '@env';

export const downloadAndOpenExcel = async (type: 'created' | 'deleted') => {
  const url =
    type === 'created'
      ? `${API_URL}/api/excel?createdLog=1`
      : `${API_URL}/api/excel?deletedLog=1`;

  const granted = await requestStoragePermission();
  if (!granted) {
    Alert.alert('Нет доступа', 'Разрешите доступ к памяти для загрузки файла');
    return;
  }

  const fileName = `${type}-logs.xlsx`;
  const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    const res = await RNFS.downloadFile({ fromUrl: url, toFile: path }).promise;

    if (res.statusCode === 200) {
      Alert.alert(
        'Файл загружен',
        'Что вы хотите сделать?',
        [
          {
            text: 'Открыть',
            onPress: () => FileViewer.open(path, { showOpenWithDialog: true }),
          },
          {
            text: 'Поделиться',
            onPress: () =>
              Share.open({
                title: 'Файл журнала',
                url: `file://${path}`,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                failOnCancel: false,
              }),
          },
          {
            text: 'Отмена',
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    } else {
      Alert.alert(
        'Ошибка',
        `Не удалось загрузить файл. Код: ${res.statusCode}`,
      );
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Ошибка', 'Произошла ошибка при загрузке файла');
  }
};
