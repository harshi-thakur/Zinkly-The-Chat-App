import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Pin,
  Search,
  MessageCircle,
  Plus,
  Users,
  Loader2,
  UserPlus,
  SearchIcon,
} from "lucide-react";
import { useChatSelectors } from "../hooks/useChatSelectors";
import useChatStore from "../stores/chatStore";
import { Button } from "./ui/button";
import { Room } from "./room";
import { useCallback } from "react";
import { apiRequest } from "../lib/utils";
import { UserCard } from "./userCard";

export function ChatList() {
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);
  const setSearchMode = useChatStore((state) => state.setSearchMode);
  const searchMode = useChatStore((state) => state.searchMode);
  const searchedUsers = useChatStore((state) => state.searchedUsers);
  const setSearchedUsers = useChatStore((state) => state.setSearchedUsers);
  const { currentUser, searchQuery, pinnedRooms, filteredRooms } =
    useChatSelectors();
  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (searchMode == "conversations") return;
    const { data, error } = await apiRequest({
      url: "/api/users/search",
      method: "GET",
      params: { q: e.target.value, skip: searchedUsers.skip || 0 },
    });
    if (error) {
      console.error("Error fetching user:", error);
      return;
    } else {
      setSearchedUsers(data);
    }
  };
  const handleSearchModeToggle = useCallback(() => {
    const newMode =
      searchMode === "conversations" ? "new-rooms" : "conversations";
    setSearchMode(newMode);
    setSearchQuery("");
  }, [searchMode, setSearchMode, searchQuery]);

  if (!currentUser) return null;

  return (
    <>
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 rounded-full border-gray-300"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {/* Mode Toggle */}
      <div className=" flex items-center justify-between">
        {/* Mode Toggle */}
        <div className="  flex items-center bg-gray-100 rounded-full p-1">
          <Button
            variant={searchMode === "conversations" ? "default" : "ghost"}
            size="sm"
            className={`  hover:cursor-pointer rounded-full px-4 py-1 text-xs transition-all ${
              searchMode === "conversations"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={handleSearchModeToggle}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chats
          </Button>
          <Button
            variant={searchMode === "new-rooms" ? "default" : "ghost"}
            size="sm"
            className={` hover:cursor-pointer rounded-full px-4 py-1 text-xs transition-all ${
              searchMode === "new-rooms"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={handleSearchModeToggle}
          >
            <Users className="w-3 h-3 mr-1" />
            Discover
          </Button>
        </div>
      </div>
      {/* New UserList*/}
      {searchMode === "new-rooms" && (
        <div className="p-4 mb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <SearchIcon className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Searched Users</h3>
          </div>
          <ScrollArea className="flex-1 h-96">
            <div className="space-y-2">
              {searchedUsers.users &&
                searchedUsers.users.map((user) => (
                  <UserCard key={user._id} user={user} handleSearchModeToggle={handleSearchModeToggle} />
                ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat List */}
      {searchMode == "conversations" && (
        <ScrollArea className="flex-1">
          {/* Pinned Chats */}
          {pinnedRooms.length > 0 && (
            <div className="p-4 mb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Pin className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Pinned Chats</h3>
              </div>
              <div className="space-y-2">
                {pinnedRooms.map((room) => (
                  <Room key={room._id} room={room} />
                ))}
              </div>
            </div>
          )}
          {/* All Chats */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">All Chats</h3>
            </div>
            <div className="space-y-2">
              {filteredRooms
                .filter((room) => !room.isPinned)
                .map((room) => (
                  <Room key={room._id} room={room} />
                ))}
            </div>
          </div>
        </ScrollArea>
      )}
    </>
  );
}
