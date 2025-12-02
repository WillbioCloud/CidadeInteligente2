// src/screens/Feed/PostDetailModal.tsx (VERSÃO COM SWIPERFLATLIST)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, FlatList, TextInput, Animated, Alert, Share, Dimensions } from 'react-native';
import { GestureHandlerRootView, Swipeable, PinchGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import Reanimated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, runOnJS, withTiming } from 'react-native-reanimated';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';
import SwiperFlatList from 'react-native-swiper-flatlist'; // NOVO: Import do SwiperFlatList

import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { FeedPost, Comment, ProfileData } from './FeedScreen'; 
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, RotateCw, Play, Pause, X, Send, AtSign, Smile, Trash2 } from '../../components/Icons';

// --- COMPONENTE DE CADA POST INDIVIDUAL (NOVO) ---
const PostItem = ({ item, isActive, onLike, onShare, onOpenComments }) => {
    const player = useVideoPlayer(null, p => { p.loop = true; });
    const [isPlaying, setIsPlaying] = useState(isActive);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);

    useEffect(() => {
        const loadAndPlay = async () => {
            if (item.media_type === 'VIDEO' && item.video_url) {
                await player.replaceAsync(item.video_url);
                if (isActive) {
                    player.play();
                }
            }
        };
        loadAndPlay();
    }, [item.video_url, player]);

    useEffect(() => {
        if (isActive) {
            player.play();
            setIsPlaying(true);
        } else {
            player.pause();
            setIsPlaying(false);
        }
    }, [isActive, player]);

    const togglePlayback = useCallback(() => {
        if (item.media_type === 'VIDEO') {
            setIsPlaying(prev => {
                const next = !prev;
                next ? player.play() : player.pause();
                return next;
            });
        }
    }, [item, player]);

    const handlePlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 1);
        }
    };

    return (
        <View style={styles.mediaContainer}>
            <ZoomableMedia 
                post={item} 
                player={player} 
                onTogglePlayback={togglePlayback}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />
            {item.media_type === 'VIDEO' && !isPlaying && (
                <View style={styles.playPauseOverlay}>
                    <TouchableOpacity onPress={togglePlayback}>
                        <Play size={64} color="rgba(255,255,255,0.8)" fill="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.overlay} pointerEvents="box-none">
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        {/* O botão de fechar foi movido para fora do PostItem */}
                    </View>
                    <View style={styles.mainContent}>
                        <View style={styles.footer}>
                            <View style={styles.authorInfo}>
                                <Image source={{ uri: item.author_avatar_url || 'https://placehold.co/100' }} style={styles.authorAvatar} />
                                <Text style={styles.authorName}>{item.author_name || 'Admin'}</Text>
                                <TouchableOpacity style={styles.followButton}>
                                    <Text style={styles.followButtonText}>Seguir</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
                            {item.media_type === 'VIDEO' && (
                                <Slider 
                                    style={styles.slider} 
                                    minimumValue={0} 
                                    maximumValue={duration} 
                                    value={position} 
                                    onSlidingComplete={value => player.seek(value)} 
                                    minimumTrackTintColor="#FFFFFF" 
                                    maximumTrackTintColor="rgba(255,255,255,0.5)" 
                                    thumbTintColor="#FFFFFF" 
                                /> 
                            )}
                        </View>
                        <View style={styles.actionsBar}>
                            <TouchableOpacity style={styles.actionItem} onPress={() => onLike(item)} activeOpacity={0.7}>
                                <Heart size={32} color="white" fill={item.is_liked_by_user ? 'white' : 'none'} />
                                <Text style={styles.actionText}>{item.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem} onPress={() => onOpenComments(item)} activeOpacity={0.7}>
                                <MessageCircle size={32} color="white" />
                                <Text style={styles.actionText}>{item.comments}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem} onPress={() => onShare(item)} activeOpacity={0.7}>
                                <Share2 size={32} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                                <MoreHorizontal size={32} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
};


// --- COMPONENTE INTERNO DE MÍDIA COM ZOOM ---
const ZoomableMedia = ({ post, player, onTogglePlayback, onPlaybackStatusUpdate }: { post: FeedPost, player: ReturnType<typeof useVideoPlayer>, onTogglePlayback: () => void, onPlaybackStatusUpdate: (status: any) => void }) => {
    const [aspectRatio, setAspectRatio] = useState(9 / 16);
    const scale = useSharedValue(1);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    useEffect(() => {
        if (post?.media_type === 'IMAGE' && post.image_url) {
            Image.getSize(post.image_url, (width, height) => {
                if (height > 0) setAspectRatio(width / height);
            }, () => setAspectRatio(9 / 16));
        } else {
            setAspectRatio(9 / 16);
        }
    }, [post]);

    const onPinchEvent = useAnimatedGestureHandler({
        onActive: (event) => { scale.value = event.scale; focalX.value = event.focalX; focalY.value = event.focalY; },
        onEnd: () => { scale.value = withTiming(1); },
    });
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: focalX.value }, { translateY: focalY.value }, { translateX: -screenWidth / 2 }, { translateY: -screenHeight / 2 }, { scale: scale.value }, { translateX: -focalX.value }, { translateY: -focalY.value }, { translateX: screenWidth / 2 }, { translateY: screenHeight / 2 }] }));
    const resizeMode = aspectRatio > 1 ? 'contain' : 'cover';

    return (
        <PinchGestureHandler onGestureEvent={onPinchEvent}>
            <Reanimated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <TouchableOpacity activeOpacity={1} onPress={onTogglePlayback} style={StyleSheet.absoluteFill}>
                    {post?.media_type === 'VIDEO' && post.video_url ? (
                        <VideoView 
                            player={player} 
                            style={StyleSheet.absoluteFill} 
                            contentFit={resizeMode} 
                            nativeControls={false}
                            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                        />
                    ) : post?.image_url ? (
                        <Image source={{ uri: post.image_url }} style={{ flex: 1, width: '100%', height: '100%' }} resizeMode={resizeMode} />
                    ) : null}
                </TouchableOpacity>
            </Reanimated.View>
        </PinchGestureHandler>
    );
};

// --- COMPONENTE INTERNO DE COMENTÁRIOS ---
const RenderCommentItem = React.memo(({ item, onStartReply, onDeletePress, currentUserId }: { item: Comment, onStartReply: (comment: Comment) => void, onDeletePress: (commentId: number) => void, currentUserId: string }) => {
    const [isRepliesVisible, setRepliesVisible] = useState(false);
    const isReply = !!item.parent_comment_id;
    const hasReplies = !isReply && item.replies && item.replies.length > 0;
    const isOwner = item.user_id === currentUserId;
    const swipeableRef = useRef<Swipeable>(null);
    const handleDelete = () => { swipeableRef.current?.close(); onDeletePress(item.id); };
    const commentContent = ( <View style={[styles.commentItemContainer, isReply && styles.replyContainer]}><Image source={{ uri: item.profiles.avatar_url || 'https://placehold.co/100' }} style={isReply ? styles.replyAvatar : styles.commentAvatar} /><View style={styles.commentBody}><Text style={styles.commentAuthor}>{item.profiles.full_name}</Text><Text style={styles.commentText}>{item.content}</Text><View style={styles.commentFooter}><Text style={styles.commentTime}>{formatTimeAgo(item.created_at)}</Text><TouchableOpacity onPress={() => onStartReply(item)}><Text style={styles.replyButtonText}>Responder</Text></TouchableOpacity></View></View></View> );
    const renderRightActions = (progress: any, dragX: any, onPress: any) => { const trans = dragX.interpolate({ inputRange: [-80, 0], outputRange: [0, 80], extrapolate: 'clamp' }); return ( <TouchableOpacity style={styles.deleteButton} onPress={onPress}><Animated.View style={{ transform: [{ translateX: trans }] }}><Trash2 size={20} color="white" /></Animated.View></TouchableOpacity> ); };
    return ( <View>{isOwner ? ( <Swipeable ref={swipeableRef} renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, handleDelete)} overshootRight={false}>{commentContent}</Swipeable> ) : ( commentContent )}{hasReplies && ( <View style={{ marginLeft: 52 }}><TouchableOpacity onPress={() => setRepliesVisible(!isRepliesVisible)}><Text style={styles.viewRepliesButton}>{isRepliesVisible ? 'Ocultar respostas' : `Ver respostas (${item.replies.length})`}</Text></TouchableOpacity>{isRepliesVisible && item.replies?.map(reply => <RenderCommentItem key={reply.id} item={reply} onStartReply={onStartReply} onDeletePress={onDeletePress} currentUserId={currentUserId} />)}</View> )}</View> );
});


// --- COMPONENTE PRINCIPAL DO MODAL ---
export default function PostDetailModal({ posts, initialPostIndex = 0, isVisible, onClose }) {
    const { userProfile } = useUserStore();
    
    const [internalPosts, setInternalPosts] = useState(posts);
    const [currentIndex, setCurrentIndex] = useState(initialPostIndex);
    const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [activePostForComments, setActivePostForComments] = useState<FeedPost | null>(null);

    useEffect(() => {
        setInternalPosts(posts);
        setCurrentIndex(initialPostIndex);
    }, [posts, initialPostIndex]);
    
    useEffect(() => {
        setCurrentIndex(initialPostIndex);
    }, [initialPostIndex]);

    const handleLike = async (postToLike: FeedPost) => {
        if (!userProfile) return;
        const originalPosts = [...internalPosts];
        const newPosts = internalPosts.map(p => 
            p.id === postToLike.id 
            ? { ...p, likes: p.is_liked_by_user ? p.likes - 1 : p.likes + 1, is_liked_by_user: !p.is_liked_by_user } 
            : p
        );
        setInternalPosts(newPosts);

        const { error } = await supabase.rpc('toggle_like_post', { post_id_to_update: postToLike.id });
        if (error) {
            setInternalPosts(originalPosts);
            Alert.alert("Erro", "Não foi possível registrar sua curtida.");
        }
    };

    const handleShare = async (postToShare: FeedPost) => {
        await Share.share({ title: `Novidade: ${postToShare.title}`, message: `${postToShare.title}\n\n${postToShare.description}\n\nVeja mais no app!` });
    };
    
    const handleOpenComments = async (postForComments: FeedPost) => {
        setActivePostForComments(postForComments);
        setCommentsModalVisible(true);
        setCommentsLoading(true);
        const { data, error } = await supabase.from('post_comments').select('*, user_id, profiles(full_name, avatar_url)').eq('post_id', postForComments.id).order('created_at', { ascending: false });
        if (error) { Alert.alert('Erro', `Não foi possível carregar os comentários.`); setComments([]); }
        else { const rootComments = data.filter(c => c.parent_comment_id === null); const repliesMap = data.reduce((map, comment) => { if (comment.parent_comment_id) { if (!map[comment.parent_comment_id]) map[comment.parent_comment_id] = []; map[comment.parent_comment_id].push(comment); } return map; }, {} as Record<number, Comment[]>); rootComments.forEach(comment => { comment.replies = (repliesMap[comment.id] || []).sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); }); setComments(rootComments); }
        setCommentsLoading(false);
    };

    const handlePostComment = async () => {
        if (!newComment.trim() || !userProfile || !activePostForComments) return;
        const parentId = replyingTo ? replyingTo.id : null;
        const { error } = await supabase.from('post_comments').insert({ post_id: activePostForComments.id, user_id: userProfile.id, content: newComment.trim(), parent_comment_id: parentId });
        setNewComment(''); setReplyingTo(null);
        if (error) { Alert.alert('Erro', 'Não foi possível enviar seu comentário.'); }
        else {
            const newPosts = internalPosts.map(p => p.id === activePostForComments.id ? { ...p, comments: p.comments + 1 } : p);
            setInternalPosts(newPosts);
            await handleOpenComments(activePostForComments);
        }
    };

    const handleDeleteComment = (commentId: number) => {
        Alert.alert("Apagar Comentário", "Tem certeza?",
          [{ text: "Cancelar", style: "cancel" }, { text: "Apagar", style: "destructive", onPress: async () => {
            const { error } = await supabase.from('post_comments').delete().eq('id', commentId);
            if (error) { Alert.alert("Erro", "Não foi possível apagar o comentário."); }
            else {
                const newPosts = internalPosts.map(p => p.id === activePostForComments!.id ? { ...p, comments: p.comments - 1 } : p);
                setInternalPosts(newPosts);
            }
            await handleOpenComments(activePostForComments!);
          }}]
        );
    };
    
    // Detecta swipe lateral para fechar
    const panRef = useRef(null);
    const panX = useSharedValue(0);

    const onPanGestureEvent = useAnimatedGestureHandler({
        onActive: (event) => {
            panX.value = event.translationX;
        },
        onEnd: (event) => {
            if (event.translationX > 120) { // Swipe para direita
                runOnJS(onClose)();
            }
            panX.value = 0;
        },
    });

    const panStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: panX.value }],
    }));

    return (
        <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={onClose}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PanGestureHandler onGestureEvent={onPanGestureEvent} activeOffsetX={[-10, 10]}>
                    <Reanimated.View style={[{ flex: 1 }, panStyle]}>
                        {/* TODO: Todos os gestos e componentes internos ficam aqui */}
                        <View style={styles.container}>
                            <SwiperFlatList
                                vertical
                                data={internalPosts}
                                index={currentIndex}
                                renderItem={({ item, index }) => (
                                    <PostItem
                                        item={item}
                                        isActive={index === currentIndex}
                                        onLike={handleLike}
                                        onShare={handleShare}
                                        onOpenComments={handleOpenComments}
                                    />
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                onChangeIndex={({ index }) => setCurrentIndex(index)}
                            />
                            {/* Botão de fechar */}
                            <SafeAreaView style={styles.headerAbsolute}>
                                <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                                    <ArrowLeft size={24} color="white" />
                                </TouchableOpacity>
                            </SafeAreaView>
                        </View>
                        {activePostForComments && (
                            <Modal animationType="slide" transparent={true} visible={isCommentsModalVisible} onRequestClose={() => setCommentsModalVisible(false)}>
                                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                                    <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => setCommentsModalVisible(false)} />
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                            <View style={styles.grabber} />
                                            <Text style={styles.modalTitle}>{activePostForComments.comments || 0} comentários</Text>
                                            <TouchableOpacity onPress={() => { setCommentsModalVisible(false); setReplyingTo(null); }} style={styles.closeButton}>
                                                <X size={24} color="#333" />
                                            </TouchableOpacity>
                                        </View>
                                        {commentsLoading ? (
                                            <ActivityIndicator style={{flex: 1, padding: 50}} size="large" />
                                        ) : (
                                            <FlatList 
                                                data={comments} 
                                                renderItem={({item}) => (
                                                    <RenderCommentItem 
                                                        item={item} 
                                                        onStartReply={setReplyingTo} 
                                                        onDeletePress={handleDeleteComment} 
                                                        currentUserId={userProfile!.id} 
                                                    />
                                                )} 
                                                keyExtractor={(item) => item.id.toString()} 
                                                contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 20}} 
                                                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum comentário ainda.</Text>} 
                                            />
                                        )}
                                        <View style={styles.commentInputContainer}>
                                            {replyingTo && (
                                                <View style={styles.replyingToBanner}>
                                                    <Text style={styles.replyingToText}>Respondendo a {replyingTo.profiles.full_name}</Text>
                                                    <TouchableOpacity onPress={() => setReplyingTo(null)}>
                                                        <X size={16} color="#6B7280" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            <View style={styles.commentInputRow}>
                                                <Image source={{ uri: userProfile?.avatar_url || 'https://placehold.co/100' }} style={styles.commentInputAvatar}/>
                                                <View style={styles.inputWrapper}>
                                                    <TextInput 
                                                        style={styles.commentInput} 
                                                        placeholder="Adicionar comentário..." 
                                                        placeholderTextColor="#6B7280" 
                                                        value={newComment} 
                                                        onChangeText={setNewComment} 
                                                        multiline 
                                                    />
                                                    <View style={styles.inputIcons}>
                                                        <TouchableOpacity><AtSign size={20} color="#6B7280" /></TouchableOpacity>
                                                        <TouchableOpacity><Smile size={20} color="#6B7280" /></TouchableOpacity>
                                                    </View>
                                                </View>
                                                {newComment.trim().length > 0 && (
                                                    <TouchableOpacity style={styles.sendButton} onPress={handlePostComment} activeOpacity={0.7}>
                                                        <Send size={24} color={'#3B82F6'} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </KeyboardAvoidingView>
                            </Modal>
                        )}
                    </Reanimated.View>
                </PanGestureHandler>
            </GestureHandlerRootView>
        </Modal>
    );
}

// --- ESTILOS ---
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    mediaContainer: { width, height, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' },
    safeArea: { flex: 1, justifyContent: 'space-between' },
    headerAbsolute: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 10 },
    iconButton: { padding: 8, paddingTop: Platform.OS === 'ios' ? 72 : 20, marginHorizontal: 12 },
    playPauseOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
    mainContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 20 },
    footer: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 10 },
    authorInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    authorAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'white', marginRight: 12 },
    authorName: { color: 'white', fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    followButton: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, marginLeft: 16 },
    followButtonText: { color: 'black', fontWeight: 'bold', fontSize: 14 },
    description: { color: 'white', fontSize: 15, lineHeight: 22, marginBottom: 10, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    slider: { width: '100%', height: 40 },
    actionsBar: { justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10, gap: 24 },
    actionItem: { alignItems: 'center' },
    actionText: { color: 'white', fontSize: 13, fontWeight: '600', marginTop: 4, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContainer: { height: '85%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
    modalHeader: { alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    grabber: { width: 40, height: 5, backgroundColor: '#CBD5E1', borderRadius: 2.5, marginBottom: 10 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
    closeButton: { position: 'absolute', right: 16, top: 18 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#6B7280', fontSize: 16 },
    commentItemContainer: { flexDirection: 'row', paddingVertical: 12, paddingRight: 16, backgroundColor: 'white' },
    commentAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
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
