import { Subscription } from '@unimodules/react-native-adapter';
import { Magnetometer } from 'expo-sensors';

type SubscriptionType = Subscription | null;
type SubscriptionSetter = React.Dispatch<React.SetStateAction<Subscription | null>>;

export class MagnetometerSubscription {
    static unsubscribe(subscription : SubscriptionType, setSubscription : SubscriptionSetter) {
        subscription?.remove();
        setSubscription(null);
    }

    static magnetometerAngle(magnetometer : any) {
        let angle = 0
        if (magnetometer) {
          let { x, y, z } = magnetometer;
    
          if (Math.atan2(y, x) >= 0) {
            angle = Math.atan2(y, x) * (180 / Math.PI);
          }
          else {
            angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
          }
        }
    
        return Math.round(angle);
      };

    static magnetometerDegree (magnetometer : number) {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    static getTurningDegree(magnetometer : any) {
        return this.magnetometerDegree(this.magnetometerAngle(magnetometer));
    }

    static async subscribe(setSubscription : SubscriptionSetter, setHeading : React.Dispatch<React.SetStateAction<number | undefined>>) {
        setSubscription(Magnetometer.addListener((data) => {
            setHeading(this.getTurningDegree(data));
        }));
    }
}
