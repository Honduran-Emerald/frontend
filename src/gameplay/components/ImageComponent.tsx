import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useAppSelector } from '../../redux/hooks';

import { GameplayImageComponent } from '../../types/quest';
import { getImageAddress } from '../../utils/imageHandler';
import { SingleComponentProps } from '../ComponentRenderer';

export const ImageComponent: React.FC<SingleComponentProps<GameplayImageComponent>> = ({ data }) => {

  const [modalVisible, setModalVisible] = React.useState(false);

  const newImages = useAppSelector(state => state.editor.newImages)

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  //@ts-ignore
  if (!(data.imageId || newImages.find(ni => ni.reference === data.imageReference))) {
    return (<></>)
  }

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback onPress={showModal}>
        {/* This is easier than rebuilding the whole class around prototypes
        //@ts-ignore */}
        <Image style={styles.image} source={{uri: data.imageId ? getImageAddress(data.imageId, '') : `data:image/gif;base64,${newImages.find(ni => ni.reference === data.imageReference)?.image}`}}/>
      </TouchableNativeFeedback>
      <Portal>
        <Modal visible={modalVisible} dismissable onDismiss={hideModal}>
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={styles.modal}>
              <Image style={styles.modalImage} resizeMethod={'scale'} resizeMode={'contain'} 
                /* This is easier than rebuilding the whole class around prototypes
                //@ts-ignore */   
                source={{uri: data.imageId ? getImageAddress(data.imageId, '') : `data:image/gif;base64,${newImages.find(ni => ni.reference === data.imageReference)?.image}`}}/>
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
