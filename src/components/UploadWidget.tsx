import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, MAX_FILE_SIZE } from '@/constants'
import { UploadWidgetProps, UploadWidgetValue } from '@/types'
import { UploadCloud } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const UploadWidget = ({ value = null, onChange, disabled = false }: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null)
  const onChangeRef = useRef(onChange)
  const [preview,setPreview] = useState<UploadWidgetValue | null>(value)
  


  useEffect(()=>{
    setPreview(value);
    

  },[value])
  useEffect(()=>{
    onChangeRef.current = onChange
  },[onChange])

  useEffect(()=>{
    if(typeof window === 'undefined') return
    const initializeWidget = ()=>{
      if(!window.cloudinary || widgetRef.current) return false;
      widgetRef.current = window.cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple:false,
        folder: 'uploads',
        maxFileSize: MAX_FILE_SIZE,
        clientAllowedFormats: ['png','jpg','jpeg','webp']
      },(error,result)=>{
        if(!error && result?.event === "success"){
          const payload: UploadWidgetValue = {
            url:result.info.secure_url,
            publicId:result.info.public_id
          }
          setPreview(payload)
          onChangeRef.current?.(payload)
        }
        
      })
      return true;
    }
    if(initializeWidget()) return;
    const intervalId = window.setInterval(()=>{
      if(initializeWidget()) {
        window.clearInterval(intervalId)
      }
    },500)
    return () => window.clearInterval(intervalId)
  },[onChange])
  const openWidget= ()=>{
    if(!disabled){
      widgetRef.current?.open()
    }

  }

  // const removeFromclodinary = async()=>{}

  return (
    <div className='space-y-2'>
      {preview ? (
        <div className='upload-preview'>
          <img
            src={preview.url}
            alt="Uploaded Banner"
            className="h-full w-full object-cover"
          />
        </div>

      ) : (
        <button type="button" className="upload-dropzone" onClick={openWidget} disabled={disabled}>
        <div className='upload-prompt'>
          <UploadCloud className='icon' aria-hidden="true" />
          <div>
            <p>Upload banner image</p>
            <p>PNG, JPG, or WebP up to 3 MB</p>
          </div>
        </div>
        </button>
      )}
      {preview && (
        <button type="button" className="text-sm font-medium text-primary underline" onClick={openWidget} disabled={disabled}>
          Change banner image
        </button>
      )}
    </div>
  )
}

export default UploadWidget
