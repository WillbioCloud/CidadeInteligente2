// src/screens/Feed/FeedScreen.tsx (VERSÃO FINAL, COMPLETA E ESTÁVEL)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Image, Share, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { supabase } from '../../lib/supabase';
import { Heart, MessageCircle, Share2, Eye, X, Send, AtSign, Smile, ArrowLeft, Trash2, MoreHorizontal, Volume2, VolumeX } from '../../components/Icons';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { useUserStore } from '../../hooks/useUserStore';
import { VideoView, useVideoPlayer } from 'expo-video';
import PostDetailModal from './PostDetailModal';

// --- INTERFACES ---
export interface FeedPost {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  media_type?: 'IMAGE' | 'VIDEO';
  published_at: string;
  likes: number;
  comments: number;
  views?: number;
  is_liked_by_user: boolean;
  author_avatar_url?: string;
  author_name?: string;
  location?: string;
}
export interface ProfileData { full_name: string; avatar_url: string | null; }
export interface Comment { id: number; user_id: string; content: string; created_at: string; likes: number; profiles: ProfileData; parent_comment_id: number | null; replies?: Comment[]; }

// --- COMPONENTE POSTCARD COM VÍDEO ---
const PostCard = ({ item, onPostPress, onLikePress, onCommentPress, onSharePress, isViewable, isAnyModalOpen }) => {
  const player = useVideoPlayer(item.video_url || '', p => { p.loop = true; p.muted = true; });
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (item.media_type === 'VIDEO' && item.video_url) { player.replaceAsync(item.video_url); }
  }, [item.video_url, player]);

  useEffect(() => {
    if (isAnyModalOpen || !isViewable) {
      player.pause();
    } else {
      player.play();
    }
  }, [isViewable, isAnyModalOpen, player]);

  const toggleMute = (e) => { e.stopPropagation(); player.muted = !player.muted; setIsMuted(!isMuted); };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}><View style={{ flexDirection: 'row', alignItems: 'center' }}><Image source={{ uri: item.author_avatar_url || 'https://placehold.co/100/4F46E5/FFFFFF?text=F' }} style={styles.authorAvatar} /><View><Text style={styles.authorName}>{item.author_name || 'FBZ Empreendimentos'}</Text><Text style={styles.postLocation}>{item.location || 'Cidade Inteligente'}</Text></View></View><TouchableOpacity><MoreHorizontal size={24} color="#111827" /></TouchableOpacity></View>
      <TouchableWithoutFeedback onPress={onPostPress}>
        <View style={styles.mediaContainer}>
          {item.media_type === 'VIDEO' && item.video_url ? (
            <><VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} /><TouchableOpacity style={styles.muteButton} onPress={toggleMute}>{isMuted ? <VolumeX size={20} color="white" /> : <Volume2 size={20} color="white" />}</TouchableOpacity></>
          ) : ( <Image source={{ uri: item.image_url }} style={styles.cardImage} /> )}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.cardFooter}><View style={styles.stats}><TouchableOpacity style={styles.statItem} onPress={onLikePress}><Heart size={24} color={item.is_liked_by_user ? "#EF4444" : "#374151"} fill={item.is_liked_by_user ? "#EF4444" : "none"} /><Text style={styles.statText}>{item.likes}</Text></TouchableOpacity><TouchableOpacity style={styles.statItem} onPress={onCommentPress}><MessageCircle size={24} color="#374151" /><Text style={styles.statText}>{item.comments}</Text></TouchableOpacity><TouchableOpacity style={styles.statItem} onPress={onSharePress}><Share2 size={24} color="#374151" /></TouchableOpacity></View><View style={styles.statItem}><Eye size={20} color="gray" /><Text style={styles.statText}>{item.views || 0}</Text></View></View>
      <View style={styles.cardContent}><Text style={styles.cardDescription} numberOfLines={2}><Text style={{ fontWeight: 'bold' }}>{item.author_name || 'FBZ'}</Text> {item.description}</Text></View>
    </View>
  );
};

// --- COMPONENTE DE COMENTÁRIOS ---
const RenderCommentItem = React.memo(({ item, onStartReply, onDeletePress, currentUserId }: { item: Comment, onStartReply: (comment: Comment) => void, onDeletePress: (commentId: number) => void, currentUserId: string }) => {
    const [isRepliesVisible, setRepliesVisible] = useState(false);
    const isReply = !!item.parent_comment_id;
    const hasReplies = !isReply && item.replies && item.replies.length > 0;
    const isOwner = item.user_id === currentUserId;
    const swipeableRef = useRef<Swipeable>(null);
    const handleDelete = () => { swipeableRef.current?.close(); onDeletePress(item.id); };
    const commentContent = ( <View style={[styles.commentItemContainer, isReply && styles.replyContainer]}><Image source={{ uri: item.profiles.avatar_url || 'https://placehold.co/100' }} style={isReply ? styles.replyAvatar : styles.commentAvatar} /><View style={styles.commentBody}><Text style={styles.commentAuthor}>{item.profiles.full_name}</Text><Text style={styles.commentText}>{item.content}</Text><View style={styles.commentFooter}><Text style={styles.commentTime}>{formatTimeAgo(item.created_at)}</Text><TouchableOpacity onPress={() => onStartReply(item)}><Text style={styles.replyButtonText}>Responder</Text></TouchableOpacity></View></View></View> );
    const renderRightActions = (progress, dragX, onPress) => { const trans = dragX.interpolate({ inputRange: [-80, 0], outputRange: [0, 80], extrapolate: 'clamp' }); return ( <TouchableOpacity style={styles.deleteButton} onPress={onPress}><Animated.View style={{ transform: [{ translateX: trans }] }}><Trash2 size={20} color="white" /></Animated.View></TouchableOpacity> ); };
    return ( <View>{isOwner ? ( <Swipeable ref={swipeableRef} renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, handleDelete)} overshootRight={false}>{commentContent}</Swipeable> ) : ( commentContent )}{hasReplies && ( <View style={{ marginLeft: 52 }}><TouchableOpacity onPress={() => setRepliesVisible(!isRepliesVisible)}><Text style={styles.viewRepliesButton}>{isRepliesVisible ? 'Ocultar respostas' : `Ver respostas (${item.replies.length})`}</Text></TouchableOpacity>{isRepliesVisible && item.replies?.map(reply => <RenderCommentItem key={reply.id} item={reply} onStartReply={onStartReply} onDeletePress={onDeletePress} currentUserId={currentUserId} />)}</View> )}</View> );
});

// --- TELA PRINCIPAL DO FEED ---
export default function FeedScreen({ navigation }) {
  const { userProfile } = useUserStore();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [viewableItems, setViewableItems] = useState<string[]>([]);
  
  const [detailModalIndex, setDetailModalIndex] = useState<number | null>(null);
  const isDetailModalVisible = detailModalIndex !== null;

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems: visibleItems }) => { setViewableItems(visibleItems.map(item => item.key as string)); };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const fetchFeed = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    if (!userProfile?.id) { setLoading(false); return; }
    const { data, error } = await supabase.rpc('get_news_feed_with_likes', { p_user_id: userProfile.id });
    if (error) { Alert.alert("Erro", "Não foi possível carregar as novidades."); } else { setPosts(data || []); }
    if (showLoader) setLoading(false);
  }, [userProfile?.id]);

  useEffect(() => {
    if (!isDetailModalVisible && !isCommentsModalVisible) {
        fetchFeed();
    }
  }, [isDetailModalVisible, isCommentsModalVisible]);

  const handleLike = async (post: FeedPost) => {
    if (!userProfile) return;
    const originalPosts = posts;
    const newPosts = posts.map(p => p.id === post.id ? { ...p, likes: p.is_liked_by_user ? p.likes - 1 : p.likes + 1, is_liked_by_user: !p.is_liked_by_user } : p);
    setPosts(newPosts);
    const { error } = await supabase.rpc('toggle_like_post', { post_id_to_update: post.id });
    if (error) { setPosts(originalPosts); Alert.alert("Erro", "Não foi possível registrar sua curtida."); }
  };

  const handleShare = async (post: FeedPost) => { await Share.share({ title: `Novidade: ${post.title}`, message: `${post.title}\n\n${post.description}\n\nVeja mais no app!` }); };
  const handleOpenComments = async (post: FeedPost) => {
    setSelectedPostForComments(post);
    setCommentsModalVisible(true);
    setCommentsLoading(true);
    const { data, error } = await supabase.from('post_comments').select('*, user_id, profiles(full_name, avatar_url)').eq('post_id', post.id).order('created_at', { ascending: false });
    if (error) { Alert.alert('Erro', `Não foi possível carregar os comentários.`); setComments([]); }
    else { const rootComments = data.filter(c => c.parent_comment_id === null); const repliesMap = data.reduce((map, comment) => { if (comment.parent_comment_id) { if (!map[comment.parent_comment_id]) map[comment.parent_comment_id] = []; map[comment.parent_comment_id].push(comment); } return map; }, {}); rootComments.forEach(comment => { comment.replies = (repliesMap[comment.id] || []).sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); }); setComments(rootComments); }
    setCommentsLoading(false);
  };
  const handlePostComment = async () => {
    if (!newComment.trim() || !userProfile || !selectedPostForComments) return;
    const { error } = await supabase.from('post_comments').insert({ post_id: selectedPostForComments.id, user_id: userProfile.id, content: newComment.trim(), parent_comment_id: replyingTo ? replyingTo.id : null });
    setNewComment(''); setReplyingTo(null);
    if (error) { Alert.alert('Erro', 'Não foi possível enviar seu comentário.'); }
    else { await handleOpenComments(selectedPostForComments); fetchFeed(false); }
  };
  const handleDeleteComment = (commentId: number) => {
    Alert.alert("Apagar Comentário", "Tem certeza?",
      [{ text: "Cancelar", style: "cancel" }, { text: "Apagar", style: "destructive", onPress: async () => {
        const { error } = await supabase.from('post_comments').delete().eq('id', commentId);
        if (error) { Alert.alert("Erro", "Não foi possível apagar o comentário."); }
        else { fetchFeed(false); await handleOpenComments(selectedPostForComments!); }
      }}]
    );
  };
  
  const handleOpenPostDetail = (index: number) => { setDetailModalIndex(index); };
  const handleClosePostDetail = () => { setDetailModalIndex(null); fetchFeed(false); };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backButton}><ArrowLeft size={24} color="#333" /></TouchableOpacity><Text style={styles.headerTitle}>Novidades</Text><View style={{ width: 40 }} /></View>
        {loading ? <ActivityIndicator style={{ flex: 1 }} size="large" /> : (
          <FlatList 
            data={posts} 
            renderItem={({ item, index }) => ( 
              <PostCard 
                item={item} 
                onPostPress={() => handleOpenPostDetail(index)} 
                onLikePress={() => handleLike(item)} 
                onCommentPress={() => handleOpenComments(item)} 
                onSharePress={() => handleShare(item)} 
                isViewable={viewableItems.includes(String(item.id))} 
                isAnyModalOpen={isDetailModalVisible || isCommentsModalVisible} 
              /> 
            )} 
            keyExtractor={(item) => String(item.id)} 
            contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 8 }} 
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma novidade por aqui ainda.</Text>} 
            onRefresh={() => fetchFeed(true)} 
            refreshing={loading} 
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current} 
            windowSize={3} 
          />
        )}
      </SafeAreaView>

      {isDetailModalVisible && (
        <PostDetailModal 
          posts={posts}
          initialPostIndex={detailModalIndex}
          isVisible={isDetailModalVisible} 
          onClose={handleClosePostDetail} 
        />
      )}

      <Modal animationType="slide" transparent={true} visible={isCommentsModalVisible} onRequestClose={() => setCommentsModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => setCommentsModalVisible(false)} />
          <View style={styles.modalContainer}><View style={styles.modalHeader}><View style={styles.grabber} /><Text style={styles.modalTitle}>{selectedPostForComments?.comments || 0} comentários</Text><TouchableOpacity onPress={() => { setCommentsModalVisible(false); setReplyingTo(null); }} style={styles.closeButton}><X size={24} color="#333" /></TouchableOpacity></View>
            {commentsLoading ? <ActivityIndicator style={{flex: 1, padding: 50}} size="large" /> : ( <FlatList data={comments} renderItem={({item}) => (<RenderCommentItem item={item} onStartReply={setReplyingTo} onDeletePress={handleDeleteComment} currentUserId={userProfile!.id} />)} keyExtractor={(item) => item.id.toString()} contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 20}} ListEmptyComponent={<Text style={styles.emptyText}>Nenhum comentário ainda.</Text>} /> )}
            <View style={styles.commentInputContainer}>{replyingTo && ( <View style={styles.replyingToBanner}><Text style={styles.replyingToText}>Respondendo a {replyingTo.profiles.full_name}</Text><TouchableOpacity onPress={() => setReplyingTo(null)}><X size={16} color="#6B7280" /></TouchableOpacity></View> )}<View style={styles.commentInputRow}><Image source={{ uri: userProfile?.avatar_url || 'https://placehold.co/100' }} style={styles.commentInputAvatar}/><View style={styles.inputWrapper}><TextInput style={styles.commentInput} placeholder="Adicionar comentário..." placeholderTextColor="#6B7280" value={newComment} onChangeText={setNewComment} multiline /><View style={styles.inputIcons}><TouchableOpacity><AtSign size={20} color="#6B7280" /></TouchableOpacity><TouchableOpacity><Smile size={20} color="#6B7280" /></TouchableOpacity></View></View>{newComment.trim().length > 0 && (<TouchableOpacity style={styles.sendButton} onPress={handlePostComment}><Send size={24} color={'#3B82F6'} /></TouchableOpacity>)}</View></View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </GestureHandlerRootView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#6B7280', fontSize: 16 },
  card: { backgroundColor: '#F8FAFC', borderRadius: 24, marginHorizontal: 8, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  authorAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  authorName: { fontWeight: 'bold', fontSize: 15 },
  postLocation: { fontSize: 12, color: '#6B7280' },
  mediaContainer: { width: '100%', height: 450, backgroundColor: '#F3F4F6', borderRadius: 12, overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%' },
  video: { width: '100%', height: '100%' },
  muteButton: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statText: { color: '#374151', fontSize: 14, fontWeight: '600' },
  cardContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  cardDescription: { fontSize: 14, lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContainer: { height: '85%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  modalHeader: { alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  grabber: { width: 40, height: 5, backgroundColor: '#CBD5E1', borderRadius: 2.5, marginBottom: 10 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  closeButton: { position: 'absolute', right: 16, top: 18 },
  commentItemContainer: { flexDirection: 'row', paddingVertical: 12, paddingRight: 16, backgroundColor: 'white' },
  commentBody: { flex: 1, justifyContent: 'center' },
  commentAuthor: { fontWeight: 'bold', color: '#1E293B' },
  commentText: { color: '#334155', marginTop: 2, lineHeight: 20 },
  commentFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 16 },
  commentTime: { color: '#94A3B8', fontSize: 12 },
  replyButtonText: { color: '#6B7280', fontSize: 12, fontWeight: 'bold' },
  viewRepliesButton: { color: '#4F46E5', fontSize: 13, fontWeight: 'bold', marginTop: 10 },
  replyContainer: { marginTop: 16, marginLeft: -25 },
  replyAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  commentInputContainer: { borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF', padding: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 8 },
  replyingToBanner: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8, marginBottom: 8 },
  replyingToText: { color: '#475569', fontSize: 12 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center' },
  commentInputAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  inputWrapper: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 22, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  commentInput: { flex: 1, paddingTop: Platform.OS === 'ios' ? 10 : 0, paddingBottom: Platform.OS === 'ios' ? 10 : 0, fontSize: 15, color: '#1E293B' },
  inputIcons: { flexDirection: 'row', gap: 12, paddingLeft: 8 },
  sendButton: { paddingLeft: 12 },
  deleteButton: { backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', width: 80, height: '100%' },
});
