import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, MAX_FILE_SIZE } from '@/constants'
import { UploadWidgetValue } from '@/types'
import { UploadCloud, UploadCloudIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const UploadWidget = ({value=null,onChange,disabled = false}) => {
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
        maxFileSize: 5000000,
        clientsAllowedFormat: ['png','jpg','jpeg','webp']
      },(error,result)=>{
        if(!error && result.event === "success"){
          const payload: UploadWidgetValue = {
            url:result.info.secure,
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

      ): <div className= "upload-dropdown" role='button' tabIndex={0} onClick={openWidget} onKeyDown={(event)=>{
        if(event.key === "Enter"){
          event.preventDefault()
          openWidget()
        }
      }}>
        <div className='upload-prompt'>
          <UploadCloud className='icon' />
          <div>
            <p>Click to Upload Photo</p>
            <p>PNG,JPG up to 5MB</p>
          </div>
        </div>
      </div> }
    </div>
  )
}

export default UploadWidget