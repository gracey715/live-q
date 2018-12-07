import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.IncomingPhoneNumber;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber ;


public class Smsmessage {
    public static final String SID = "AC88493f5881ce0e2c048f719b68113d6e";
    public static final String AUTH_TOKEN = "f24e1120b5e018fe8db7c461a991814c";
    public static void main(String[] args) {
        Twilio.init(SID, AUTH_TOKEN);
//        IncomingPhoneNumber incomingPhoneNumber = IncomingPhoneNumber.creator(new PhoneNumber("16464794830")).create();

        Message message = Message.creator(new PhoneNumber("+16464794830"),
                new PhoneNumber("+18627019037"),
                                            "You are the next in line").create();
        System.out.println(message.getSid());
    }
}
