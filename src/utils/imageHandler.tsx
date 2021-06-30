
import { Colors } from "../styles";
import { BACKENDIP } from '../../GLOBALCONFIG'

export const getImageAddress = (imageId: string | null, userName: string) => {
  return (imageId) ? `${BACKENDIP}/image/get/${imageId}` : `https://ui-avatars.com/api/?length=1&color=FFF&name=${userName}&background=${Colors.primary.substring(1)}&size=256`
}