import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useChatStore from "../stores/chatStore";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { apiRequest } from "../lib/utils";
export function UserCard({ user ,handleSearchModeToggle}) {
  const navigate = useNavigate();
  const handleUserSelect = (userId) => {
          useChatStore.getState().setSearchQuery("");
          useChatStore.getState().setSearchedUsers({ users: [], skip: 0 });
          useChatStore.getState().setSearchMode("conversations");
          apiRequest({
            url: '/api/rooms/',
            method: 'POST',
            body: {
              members: [userId],
              isGroup: false,
            },
          })
          .then(({ data, error }) => {
            if(error) {
              console.error("Error creating room:", error);
              return;
            }
            useChatStore.getState().setRooms([data.room])
            data.room.members.forEach((member) => {
              useChatStore.getState().setUserOnline(member._id,member.isOnline);
            });
          })
  };
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors`}
    >
      <div className="flex justify-between items-center  w-full">
     
          <div className="flex  items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.profilePic || "/placeholder.svg"} />
              <AvatarFallback className="bg-purple-500 text-white">
                {user.fullname
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
         
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-gray-900 truncate">
                {user.fullname}
              </p>
              <p className="font-medium text-gray-400 truncate">
                {'@'+user.username}
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full hover:cursor-pointer"
          onClick={() => {handleUserSelect(user._id), handleSearchModeToggle()}}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
