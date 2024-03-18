import React, { useState } from 'react'
import {Outlet} from 'react-router-dom'
import { RoomProvider } from '../contexts/RoomContext'

function BaseLayout(){
  return (
    <RoomProvider>
        <div className=' w-full h-screen'>
            <Outlet/>
        </div>
    </RoomProvider>
  )
}

export default BaseLayout