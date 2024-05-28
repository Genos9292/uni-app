import picker from '@ohos.file.picker';
import image from '@ohos.multimedia.image';
import media from '@ohos.multimedia.media';
import fs from '@ohos.file.fs';
import picker1 from '@ohos.file.picker';
import picker2 from '@ohos.file.picker';
export function initUniExtApi(uniExtApi: ESObject, shared: ESObject, UTSJSONObject: ESObject, UTSJSONObject: ESObject) {
    const API_CHOOSE_IMAGE = 'chooseImage';
    const API_CHOOSE_VIDEO = 'chooseVideo';
    const API_GET_IMAGE_INFO = 'getImageInfo';
    const API_GET_VIDEO_INFO = 'getVideoInfo';
    type MediaOrientation = 'up' | 'down' | 'left' | 'right' | 'up-mirrored' | 'down-mirrored' | 'left-mirrored' | 'right-mirrored';
    type MediaErrorCode = 1101001 | 1101002 | 1101003 | 1101004 | 1101005 | 1101006 | 1101007 | 1101008 | 1101009 | 1101010;
    interface IMediaError extends IUniError {
        errCode: MediaErrorCode;
    }
    class ChooseImageSuccess extends UTSObject {
        errSubject!: string;
        errMsg!: string;
        tempFilePaths!: Array<string>;
        tempFiles!: Object;
    }
    type ChooseImageFail = IMediaError;
    type ChooseImageSuccessCallback = (callback: ChooseImageSuccess) => void;
    type ChooseImageFailCallback = (callback: ChooseImageFail) => void;
    type ChooseImageCompleteCallback = (callback: Object) => void;
    class ChooseImageCropOptions extends UTSObject {
        width!: number;
        height!: number;
        quality: (number) | null = null;
        resize: (boolean) | null = null;
    }
    class ChooseImageOptions extends UTSObject {
        count: (number) | null = null;
        sizeType: (string[]) | null = null;
        sourceType: (string[]) | null = null;
        extension: (string[]) | null = null;
        crop: (ChooseImageCropOptions) | null = null;
        success: (ChooseImageSuccessCallback) | null = null;
        fail: (ChooseImageFailCallback) | null = null;
        complete: (ChooseImageCompleteCallback) | null = null;
    }
    type ChooseImage = (options: ChooseImageOptions) => void;
    type GetImageInfo = (options: GetImageInfoOptions) => void;
    class GetImageInfoSuccess extends UTSObject {
        width!: number;
        height!: number;
        path!: string;
        orientation: string | null = null;
        type: string | null = null;
    }
    type GetImageInfoFail = IMediaError;
    type GetImageInfoSuccessCallback = (callback: GetImageInfoSuccess) => void;
    type GetImageInfoFailCallback = (callback: GetImageInfoFail) => void;
    type GetImageInfoCompleteCallback = ChooseImageCompleteCallback;
    class GetImageInfoOptions extends UTSObject {
        src!: string.ImageURIString;
        success: (GetImageInfoSuccessCallback) | null = null;
        fail: (GetImageInfoFailCallback) | null = null;
        complete: (GetImageInfoCompleteCallback) | null = null;
    }
    class ChooseVideoSuccess extends UTSObject {
        tempFilePath!: string;
        duration!: number;
        size!: number;
        height!: number;
        width!: number;
    }
    type ChooseVideoFail = IMediaError;
    type ChooseVideoSuccessCallback = (callback: ChooseVideoSuccess) => void;
    type ChooseVideoFailCallback = (callback: ChooseVideoFail) => void;
    type ChooseVideoCompleteCallback = ChooseImageCompleteCallback;
    class ChooseVideoOptions extends UTSObject {
        sourceType: (string[]) | null = null;
        compressed: boolean | null = true;
        maxDuration: number | null = null;
        camera: string | null = null;
        extension: (string[]) | null = null;
        success: (ChooseVideoSuccessCallback) | null = null;
        fail: (ChooseVideoFailCallback) | null = null;
        complete: (ChooseVideoCompleteCallback) | null = null;
    }
    type ChooseVideo = (options: ChooseVideoOptions) => void;
    class GetVideoInfoSuccess extends UTSObject {
        orientation: string | null = null;
        type: string | null = null;
        duration!: number;
        size!: number;
        height!: number;
        width!: number;
        fps: number | null = null;
        bitrate: number | null = null;
    }
    type GetVideoInfoFail = IMediaError;
    type GetVideoInfoSuccessCallback = (callback: GetVideoInfoSuccess) => void;
    type GetVideoInfoFailCallback = (callback: GetVideoInfoFail) => void;
    type GetVideoInfoCompleteCallback = ChooseImageCompleteCallback;
    class GetVideoInfoOptions extends UTSObject {
        src!: string.VideoURIString;
        success: (GetVideoInfoSuccessCallback) | null = null;
        fail: (GetVideoInfoFailCallback) | null = null;
        complete: (GetVideoInfoCompleteCallback) | null = null;
    }
    type GetVideoInfo = (options: GetVideoInfoOptions) => void;
    interface MediaFile {
        fileType: 'video' | 'image';
        tempFilePath: string;
        size: number;
        width?: number;
        height?: number;
        duration?: number;
        thumbTempFilePath?: string;
    }
    interface ChooseMediaOptions {
        mimeType: picker.PhotoViewMIMETypes.VIDEO_TYPE | picker.PhotoViewMIMETypes.IMAGE_TYPE;
        count?: number;
    }
    interface ChooseMediaSuccessCallbackResult {
        tempFiles: MediaFile[];
    }
    interface VideoInfo {
        size: number;
        orientation?: MediaOrientation;
        type?: string;
        duration?: number;
        height?: number;
        width?: number;
    }
    const _getVideoInfo = async (uri: string): Promise<VideoInfo> =>{
        const file = await fs.open(uri, fs.OpenMode.READ_ONLY);
        const avMetadataExtractor = await media.createAVMetadataExtractor();
        let metadata: media.AVMetadata | null = null;
        let size: number = 0;
        try {
            size = (await fs.stat(file.fd)).size;
            avMetadataExtractor.dataSrc = {
                fileSize: size,
                callback: (buffer: ArrayBuffer, length: number, pos: number | null = null)=>{
                    return fs.readSync(file.fd, buffer, {
                        offset: pos,
                        length
                    } as ReadOptions);
                }
            };
            metadata = await avMetadataExtractor.fetchMetadata();
        } catch (error) {
            throw (error as Error);
        } finally{
            await avMetadataExtractor.release();
            await fs.close(file);
        }
        const videoOrientationArr = [
            'up',
            'right',
            'down',
            'left'
        ] as MediaOrientation[];
        return {
            size: size,
            duration: metadata.duration ? Number(metadata.duration) / 1000 : undefined,
            width: metadata.videoWidth ? Number(metadata.videoWidth) : undefined,
            height: metadata.videoHeight ? Number(metadata.videoHeight) : undefined,
            type: metadata.mimeType,
            orientation: metadata.videoOrientation ? videoOrientationArr[Number(metadata.videoOrientation) / 90] : undefined
        };
    };
    interface ImageInfo {
        path: string;
        orientation: MediaOrientation;
        height: number;
        width: number;
    }
    const _getImageInfo = async (uri: string): Promise<ImageInfo> =>{
        const file = await fs.open(uri, fs.OpenMode.READ_ONLY);
        const imageSource = image.createImageSource(file.fd);
        const imageInfo = await imageSource.getImageInfo();
        const orientation = await imageSource.getImageProperty(image.PropertyKey.ORIENTATION);
        let orientationNum = 0;
        if (typeof orientation === 'string') {
            const matched = orientation.match(/^Unknown value (\d)$/);
            if (matched && matched[1]) {
                orientationNum = Number(matched[1]);
            } else if (/^\d$/.test(orientation)) {
                orientationNum = Number(orientation);
            }
        } else if (typeof orientation === 'number') {
            orientationNum = orientation;
        }
        let orientationStr: MediaOrientation = 'up';
        switch(orientationNum){
            case 2:
                orientationStr = 'up-mirrored';
                break;
            case 3:
                orientationStr = 'down';
                break;
            case 4:
                orientationStr = 'down-mirrored';
                break;
            case 5:
                orientationStr = 'left-mirrored';
                break;
            case 6:
                orientationStr = 'right';
                break;
            case 7:
                orientationStr = 'right-mirrored';
                break;
            case 8:
                orientationStr = 'left';
                break;
            case 0:
            case 1:
            default:
                orientationStr = 'up';
                break;
        }
        return {
            path: uri,
            width: imageInfo.size.width,
            height: imageInfo.size.height,
            orientation: orientationStr
        };
    };
    const _chooseMedia = async (options: ChooseMediaOptions): Promise<ChooseMediaSuccessCallbackResult> =>{
        const photoSelectOptions = new picker.PhotoSelectOptions();
        const mimeType = options.mimeType;
        photoSelectOptions.MIMEType = mimeType;
        photoSelectOptions.maxSelectNumber = options.count || 9;
        const photoPicker = new picker.PhotoViewPicker();
        const photoSelectResult = await photoPicker.select(photoSelectOptions);
        const uris = photoSelectResult.photoUris;
        if (mimeType !== picker.PhotoViewMIMETypes.VIDEO_TYPE) {
            return {
                tempFiles: uris.map((uri)=>{
                    const file = fs.openSync(uri, fs.OpenMode.READ_ONLY);
                    const stat = fs.statSync(file.fd);
                    fs.closeSync(file);
                    return {
                        fileType: 'image',
                        tempFilePath: uri,
                        size: stat.size
                    };
                })
            };
        }
        const tempFiles: MediaFile[] = [];
        for(let i = 0; i < uris.length; i++){
            const uri = uris[i];
            const videoInfo = await _getVideoInfo(uri);
            tempFiles.push({
                fileType: 'video',
                tempFilePath: uri,
                size: videoInfo.size,
                duration: videoInfo.duration,
                width: videoInfo.width,
                height: videoInfo.height
            } as UTSJSONObject);
        }
        return {
            tempFiles
        };
    };
    const chooseImage: ChooseImage = defineAsyncApi(API_CHOOSE_IMAGE, (params: ChooseMediaOptions, ref)=>{
        let resolve = ref.resolve, reject = ref.reject;
        _chooseMedia({
            mimeType: picker1.PhotoViewMIMETypes.IMAGE_TYPE,
            count: params.count
        } as ChooseMediaOptions).then((res)=>{
            return {
                tempFilePaths: res.tempFiles.map((file)=>file.tempFilePath),
                tempFiles: res.tempFiles.map((file)=>{
                    return {
                        path: file.tempFilePath,
                        size: file.size
                    };
                })
            };
        }).then(resolve, reject);
    });
    const chooseVideo: ChooseVideo = defineAsyncApi(API_CHOOSE_VIDEO, (_, ref)=>{
        let resolve = ref.resolve, reject = ref.reject;
        _chooseMedia({
            mimeType: picker2.PhotoViewMIMETypes.VIDEO_TYPE
        } as ChooseMediaOptions).then((res)=>{
            const file = res.tempFiles[0];
            return {
                tempFilePath: file.tempFilePath,
                duration: file.duration,
                size: file.size,
                width: file.width,
                height: file.height
            };
        }).then(resolve, reject);
    });
    const getImageInfo: GetImageInfo = defineAsyncApi(API_GET_IMAGE_INFO, (ref: GetImageInfoOptions, ref1)=>{
        let src = ref.src, resolve = ref1.resolve, reject = ref1.reject;
        _getImageInfo(src).then(resolve, reject);
    });
    const getVideoInfo: GetVideoInfo = defineAsyncApi(API_GET_VIDEO_INFO, (ref: GetVideoInfoOptions, ref1)=>{
        let src = ref.src, resolve = ref1.resolve, reject = ref1.reject;
        _getVideoInfo(src).then((res)=>{
            return {
                size: res.size,
                duration: res.duration!,
                width: res.width!,
                height: res.height!,
                type: res.type!,
                orientation: res.orientation!
            };
        }).then(resolve, reject);
    });
    uniExtApi.chooseImage = chooseImage;
    uniExtApi.getImageInfo = getImageInfo;
    uniExtApi.chooseVideo = chooseVideo;
    uniExtApi.getVideoInfo = getVideoInfo;
}