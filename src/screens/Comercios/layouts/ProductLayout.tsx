// src/screens/Comercios/layouts/ProductLayout.tsx

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    ScrollView, 
    Image, 
    TouchableOpacity, 
    Linking,
    Alert,
    Dimensions
} from 'react-native';
import { ArrowLeft, PlayCircle, ShoppingCart, BatteryCharging, Minimize2, ShieldCheck, Sun } from 'lucide-react-native';
import ImageView from "react-native-image-viewing";

const { width } = Dimensions.get('window');

// --- COMPONENTE DE ÍCONE DINÂMICO ---
// Mapeia uma string do JSON para um componente de ícone real
const DynamicIcon = ({ name, ...props }) => {
    switch (name) {
        case 'battery-charging':
            return <BatteryCharging {...props} />;
        case 'minimize-2':
            return <Minimize2 {...props} />;
        case 'shield-check':
            return <ShieldCheck {...props} />;
        case 'sun':
            return <Sun {...props} />;
        default:
            return <ShieldCheck {...props} />; // Ícone padrão
    }
};


// --- COMPONENTE PARA ITEM DE CARACTERÍSTICA ---
const FeatureItem = ({ feature }) => (
    <View style={styles.featureItem}>
        <DynamicIcon name={feature.icon} size={28} color="#374151" />
        <Text style={styles.featureTitle}>{feature.title || 'Característica'}</Text>
        <Text style={styles.featureDescription}>{feature.description || 'Descrição não disponível.'}</Text>
    </View>
);

// --- COMPONENTE PARA CARD DE PRODUTO ---
const ProductCard = ({ product }) => {
    const handleBuyNow = () => {
        if (product.product_url) {
            Linking.openURL(product.product_url).catch(() => {
                Alert.alert("Erro", "Não foi possível abrir o link do produto.");
            });
        } else {
            Alert.alert("Indisponível", "Este produto não possui um link de compra.");
        }
    };
    
    return (
        <View style={styles.productCard}>
            <Image 
                source={{ uri: product.image_url || 'https://i.imgur.com/gJaIjmW.png' }} 
                style={styles.productImage} 
            />
            <View style={styles.productContent}>
                <Text style={styles.productName}>{product.name || 'Nome do Produto'}</Text>
                <View style={styles.priceContainer}>
                    {product.sale_price && (
                        <Text style={styles.productSalePrice}>R$ {product.sale_price}</Text>
                    )}
                    <Text style={product.sale_price ? styles.productOriginalPrice : styles.productPrice}>
                        R$ {product.price || '0,00'}
                    </Text>
                </View>
                <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
                    <Text style={styles.buyButtonText}>COMPRAR AGORA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


export default function ProductLayout({ commerce, navigation }) {
    const [isGalleryVisible, setIsGalleryVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Formata as imagens da galeria para o visualizador
    const galleryImages = (commerce.images || []).map(url => ({ uri: url }));

    const openGallery = (index) => {
        setCurrentImageIndex(index);
        setIsGalleryVisible(true);
    };

    const handleLinkPress = (url, type = 'página') => {
        if (url) {
            Linking.openURL(url).catch(() => Alert.alert("Erro", `Não foi possível abrir a ${type}.`));
        } else {
            Alert.alert("Indisponível", `Nenhum link de ${type} foi cadastrado.`);
        }
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* --- HEADER --- */}
                    <View style={styles.header}>
                        <Image source={{ uri: commerce.logo || 'https://placehold.co/100x40/eee/333?text=Logo' }} style={styles.logo} />
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ArrowLeft size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* --- HERO SECTION --- */}
                    <View style={styles.section}>
                        <Text style={styles.slogan}>{commerce.slogan || commerce.name}</Text>
                        <Text style={styles.description}>{commerce.description || 'Descrição detalhada do produto ou serviço.'}</Text>
                        <Image source={{ uri: commerce.coverImage || 'https://i.imgur.com/gJaIjmW.png' }} style={styles.heroImage} />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.buttonSecondary} onPress={() => handleLinkPress(commerce.video_url, 'vídeo')}>
                                <PlayCircle size={18} color="#374151" />
                                <Text style={styles.buttonSecondaryText}>ASSISTIR DEMO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonPrimary} onPress={() => handleLinkPress(commerce.store_url, 'loja')}>
                                <ShoppingCart size={18} color="white" />
                                <Text style={styles.buttonPrimaryText}>VER LOJA</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- FEATURES SECTION --- */}
                    {commerce.features && commerce.features.length > 0 && (
                        <View style={styles.section}>
                            {commerce.features.map((feature, index) => (
                                <FeatureItem key={index} feature={feature} />
                            ))}
                        </View>
                    )}
                    
                    {/* --- GALLERY SECTION --- */}
                    {galleryImages.length > 0 && (
                        <View style={styles.section}>
                             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryContainer}>
                                {galleryImages.map((img, index) => (
                                    <TouchableOpacity key={index} onPress={() => openGallery(index)}>
                                        <Image source={img} style={styles.galleryImage} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* --- SECONDARY SLOGAN --- */}
                    {commerce.secondary_slogan && (
                        <View style={styles.section}>
                            <Text style={styles.secondarySlogan}>{commerce.secondary_slogan}</Text>
                        </View>
                    )}

                    {/* --- PRODUCT LIST SECTION --- */}
                    {commerce.product_list && commerce.product_list.length > 0 && (
                        <View style={styles.section}>
                            {commerce.product_list.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </View>
                    )}

                </ScrollView>
            </SafeAreaView>
            
            {/* --- IMAGE VIEWER MODAL --- */}
            <ImageView
                images={galleryImages}
                imageIndex={currentImageIndex}
                visible={isGalleryVisible}
                onRequestClose={() => setIsGalleryVisible(false)}
            />
        </>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    scrollContent: { paddingBottom: 50 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        height: 60,
    },
    logo: { width: 100, height: 40, resizeMode: 'contain' },
    backButton: { padding: 8 },
    section: { paddingHorizontal: 20, marginBottom: 32 },
    slogan: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
    description: { fontSize: 16, color: '#6B7280', lineHeight: 24, marginBottom: 24 },
    heroImage: {
        width: '100%',
        height: width * 0.9,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        marginBottom: 24,
    },
    buttonRow: { flexDirection: 'row', gap: 12 },
    buttonPrimary: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    buttonPrimaryText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    buttonSecondary: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    buttonSecondaryText: { color: '#374151', fontWeight: 'bold', fontSize: 14 },
    
    // Feature Styles
    featureItem: {
        alignItems: 'center',
        marginBottom: 24,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 12, marginBottom: 4 },
    featureDescription: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
    
    // Gallery Styles
    galleryContainer: { paddingVertical: 10 },
    galleryImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: '#E5E7EB',
    },

    // Secondary Slogan Styles
    secondarySlogan: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        lineHeight: 30,
    },

    // Product Card Styles
    productCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 2,
        shadowColor: '#4F46E5',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    productImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#F3F4F6',
    },
    productContent: { padding: 16 },
    productName: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
    priceContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16, gap: 8 },
    productPrice: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
    productSalePrice: { fontSize: 20, fontWeight: 'bold', color: '#16A34A' },
    productOriginalPrice: { fontSize: 14, color: '#9CA3AF', textDecorationLine: 'line-through' },
    buyButton: {
        backgroundColor: '#374151',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    buyButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});