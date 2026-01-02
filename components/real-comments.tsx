"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, User } from "lucide-react";

export default function RealComments() {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Fetch Comments on Load
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) setComments(data);
  };

  // 2. Handle Submission
  const handleSubmit = async () => {
    if (!newComment.trim() || !username.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from('comments')
      .insert([
        { username: username, content: newComment }
      ]);

    if (!error) {
      setNewComment(""); // Clear input
      fetchComments();   // Refresh list
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle size={18} className="text-blue-500"/> Community Discussion
        </h3>
      </div>
      
      <div className="p-6 space-y-8">
        
        {/* INPUT FORM */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
            <div className="flex gap-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border text-slate-400">
                    <User size={20} />
                </div>
                <div className="flex-1 space-y-2">
                    <Input 
                        placeholder="Your Name (e.g. Walid)" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white"
                    />
                    <Textarea 
                        placeholder="Share your market update..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="bg-white min-h-[80px]"
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {loading ? "Posting..." : <><Send size={14} className="mr-2"/> Post Comment</>}
                </Button>
            </div>
        </div>

        {/* COMMENT LIST */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                  {comment.username.charAt(0).toUpperCase()}
               </div>
               <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none border border-slate-100 flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-slate-900 text-sm">{comment.username}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{comment.content}</p>
               </div>
            </div>
          ))}

          {comments.length === 0 && (
              <p className="text-center text-slate-400 italic text-sm py-4">No comments yet. Be the first to post!</p>
          )}
        </div>

      </div>
    </div>
  );
}