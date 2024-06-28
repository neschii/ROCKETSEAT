import { format, formatDistanceToNow } from 'date-fns';
import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';
import { ptBR } from 'date-fns/locale/pt';

interface PostProps { 
  author: string;
  publishedAt: Date;
  content: Content[];

}

interface Content { 
  type: 'paragraph' | 'link';
  content: string;

}



export function Post({ author, publishedAt, content }: PostProps) {
    const [comments, setComments] = useState([
      'pedreiro'
])

    const [newCommentText, setNewCommentText] = useState('') 
    const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR
    })

    const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, { 
    locale: ptBR,
    addSuffix: true,
})

  function handleCreateNewComment(event: FormEvent) { 
   event.preventDefault()

    setComments([...comments, newCommentText]);
    setNewCommentText('');
}

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) { 
  event.target.setCustomValidity('');
  setNewCommentText(event.target.value);
}

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('Esse campo é obrigatorio!');
}

  function deleteComment(commentToDelete: string) { 
  const commentsWithoutDeletedOne = comments.filter(comment => { 
    return comment != commentToDelete;
})
  setComments(commentsWithoutDeletedOne);
  }

const isNewCommentEmpty = newCommentText.length == 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
            <Avatar src={author.avatarUrl} />     
          <div className={styles.authorInfo}>
            <strong>{author.avatar}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
          {content.map(line => { 
          if (line.type === 'paragraph') { 
        return <p key={line.content}>{line.content}</p>
    } else if (line.type === 'link') { 
        return <p><a key={line.content} href="">{line.content}</a></p>;
  }
      })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.comment}>
        Comentários
        <textarea 
        name="comment"
        placeholder="Deixe um comentário"
        value={newCommentText}
        onChange={handleNewCommentChange} 
        onInvalid={handleNewCommentInvalid}
        required
        />
        <footer>
          {' '}
          <button type="submit" disabled={isNewCommentEmpty} >Publicar</button>
        </footer>
      </form>
      <div className={styles.comment}>
{comments.map(comments => { 
    return (
<Comment 
key={comments} 
content={comments} 
onDeleteComment={deleteComment}
/> 
    )
})}
      </div>
    </article>
  )
}
