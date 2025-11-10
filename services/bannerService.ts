import { db, storage } from '../firebase';

export interface Banner {
  id: string;
  name: string;
  imageUrl: string;
  position: number;
  isActive: boolean;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BannerData {
  name: string;
  imageUrl?: string;
  imageFile?: Blob;
  position?: number;
  isActive?: boolean;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const bannerService = {
  // Récupérer toutes les bannières actives
  async getActiveBanners(): Promise<Banner[]> {
    try {
      const snapshot = await db
        .collection('banners')
        .where('isActive', '==', true)
        .orderBy('position', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as Banner));
    } catch (error) {
      console.error('Erreur lors de la récupération des bannières:', error);
      return [];
    }
  },

  // Récupérer toutes les bannières (y compris inactives)
  async getAllBanners(): Promise<Banner[]> {
    try {
      const snapshot = await db
        .collection('banners')
        .orderBy('position', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as Banner));
    } catch (error) {
      console.error('Erreur lors de la récupération des bannières:', error);
      return [];
    }
  },

  // Ajouter une nouvelle bannière
  async addBanner(bannerData: BannerData): Promise<string> {
    try {
      const now = new Date();
      let imageUrl = bannerData.imageUrl;
      
      // Si un fichier image est fourni, le téléverser d'abord
      if (bannerData.imageFile) {
        const fileName = `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        imageUrl = await this.uploadBannerImage(bannerData.imageFile, fileName);
      }
      
      const docData = {
        name: bannerData.name,
        description: bannerData.description || '',
        buttonText: bannerData.buttonText || '',
        buttonLink: bannerData.buttonLink || '',
        imageUrl: imageUrl || '',
        position: bannerData.position ?? 0,
        isActive: bannerData.isActive ?? true,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await db.collection('banners').add(docData);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la bannière:', error);
      throw error;
    }
  },

  // Mettre à jour une bannière existante
  async updateBanner(bannerId: string, bannerData: Partial<BannerData>): Promise<void> {
    try {
      const updateData: any = {
        updatedAt: new Date()
      };
      
      // Si un fichier image est fourni, le téléverser d'abord
      if (bannerData.imageFile) {
        const fileName = `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        updateData.imageUrl = await this.uploadBannerImage(bannerData.imageFile, fileName);
      } else if (bannerData.imageUrl !== undefined) {
        updateData.imageUrl = bannerData.imageUrl;
      }
      
      // Ajouter les autres propriétés si elles sont définies
      if (bannerData.name !== undefined) updateData.name = bannerData.name;
      if (bannerData.description !== undefined) updateData.description = bannerData.description;
      if (bannerData.buttonText !== undefined) updateData.buttonText = bannerData.buttonText;
      if (bannerData.buttonLink !== undefined) updateData.buttonLink = bannerData.buttonLink;
      if (bannerData.position !== undefined) updateData.position = bannerData.position;
      if (bannerData.isActive !== undefined) updateData.isActive = bannerData.isActive;
      
      await db.collection('banners').doc(bannerId).update(updateData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bannière:', error);
      throw error;
    }
  },

  // Supprimer une bannière
  async deleteBanner(id: string): Promise<void> {
    try {
      await db.collection('banners').doc(id).delete();
    } catch (error) {
      console.error('Erreur lors de la suppression de la bannière:', error);
      throw error;
    }
  },

  // Téléverser une image de bannière vers Firebase Storage
  async uploadBannerImage(imageBlob: Blob, fileName: string): Promise<string> {
    try {
      const storageRef = storage.ref();
      const bannerRef = storageRef.child(`banners/${fileName}`);
      
      await bannerRef.put(imageBlob);
      const downloadURL = await bannerRef.getDownloadURL();
      
      return downloadURL;
    } catch (error) {
      console.error('Erreur lors du téléversement de l\'image:', error);
      throw error;
    }
  },

  // Réorganiser les positions des bannières
  async reorderBanners(bannerIds: string[]): Promise<void> {
    try {
      const batch = db.batch();
      
      bannerIds.forEach((id, index) => {
        const bannerRef = db.collection('banners').doc(id);
        batch.update(bannerRef, {
          position: index,
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Erreur lors du réordonnancement des bannières:', error);
      throw error;
    }
  }
};