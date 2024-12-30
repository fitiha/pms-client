"use client"

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createComment, deleteComment, updateComment, Comment, getCurrentUser } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'

type CommentSectionProps = {
  taskId: number
  comments: Comment[]
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
}

export function CommentSection({ taskId, comments, setComments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const { toast } = useToast()
  const currentUser = getCurrentUser()

  const handleAddComment = async () => {
    try {
      const createdComment = await createComment(taskId, newComment)
      setComments(prevComments => [...prevComments, createdComment])
      setNewComment('')
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment",
      })
    }
  }

  const handleEditComment = async (commentId: number) => {
    try {
      const updatedComment = await updateComment(commentId, editedContent)
      setComments(prevComments => prevComments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ))
      setEditingCommentId(null)
      setEditedContent('')
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      })
    } catch (error) {
      console.error('Failed to update comment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update comment",
      })
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId)
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId))
        toast({
          title: "Comment deleted",
          description: "The comment has been deleted successfully.",
        })
      } catch (error) {
        console.error('Failed to delete comment:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete comment",
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
          {editingCommentId === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full"
              />
              <div className="space-x-2">
                <Button onClick={() => handleEditComment(comment.id)}>Save</Button>
                <Button variant="outline" onClick={() => setEditingCommentId(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                By {comment.author.name} on {new Date(comment.createdAt).toLocaleString()}
              </p>
              {currentUser && (currentUser.id === comment.authorId || currentUser.role === 'ADMIN') && (
                <div className="mt-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditedContent(comment.content);
                  }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteComment(comment.id)}>Delete</Button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <div className="mt-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full"
        />
        <Button onClick={handleAddComment} className="mt-2">Add Comment</Button>
      </div>
    </div>
  )
}

