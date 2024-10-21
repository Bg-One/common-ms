import React from "react";
import './index.scss'

const ImageLargeMask = ({wetherLargeObj, setWetherLargeObj}) => {
    return <div className={wetherLargeObj.open ? "imgPreview" : "imgPreviewNone"} onDoubleClick={(e) => {
        setWetherLargeObj({
            ...wetherLargeObj, open: false
        })
    }}>
        <div>
            <span className={'close-btn'}
                  onClick={(e) => {
                      setWetherLargeObj({
                          ...wetherLargeObj, open: false
                      })
                  }}>X</span>
        </div>

        <div style={{margin: 'auto'}}>
            <img src={wetherLargeObj.imageUrl}/>
        </div>

    </div>
}
export default ImageLargeMask
