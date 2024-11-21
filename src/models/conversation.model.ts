import { Schema,model } from "mongoose";
import { IConversation } from "../utils/types";

const conversationSchema= new Schema<IConversation>({
    participants:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    isGroup:{
        type:Boolean,
        default:false
    },
    groupName:{
        type:String,
        default:''
    },
    lastMessage:{
        type:Schema.Types.ObjectId,
        ref:'Message'
    }
},{timestamps:true});


const Conversation= model<IConversation>('Conversation',conversationSchema);

export default Conversation;