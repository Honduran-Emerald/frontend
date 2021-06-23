import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

import { GameplayImageComponent } from '../../types/quest';
import { SingleComponentProps } from '../ComponentRenderer';
import { getImageAddress } from '../../utils/requestHandler';

export const ImageComponent: React.FC<SingleComponentProps<GameplayImageComponent>> = ({ data }) => {

  const [modalVisible, setModalVisible] = React.useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback onPress={showModal}>
        <Image style={styles.image} source={{uri: getImageAddress(data.imageId, '')}}/>
      </TouchableNativeFeedback>
      <Portal>
        <Modal visible={modalVisible} dismissable onDismiss={hideModal}>
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={styles.modal}>
              <Image style={styles.modalImage} resizeMethod={'scale'} resizeMode={'contain'} source={{uri: getImageAddress(data.imageId, '')}}/>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '70%',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height * 0.25,
    borderRadius: 20,
    borderTopLeftRadius: 3,
  },
  modal: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});
