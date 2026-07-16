// /**
//  * File Protection Utility
//  * Prevents file writes in production mode to protect Next.js filesystem
//  */

// const isProduction = process.env.NODE_ENV === 'production'

// /**
//  * Protect filesystem from writes in production
//  * This ensures no files can be written to the Next.js production directory
//  */
// export function protectFileSystem() {
//   if (!isProduction) {
//     // In development, allow file operations
//     return
//   }

//   // Override fs methods in production (if somehow accessed server-side)
//   if (typeof window === 'undefined') {
//     try {
//       const fs = require('fs')
//       const originalWriteFileSync = fs.writeFileSync
//       const originalWriteFile = fs.writeFile
//       const originalMkdirSync = fs.mkdirSync
//       const originalUnlinkSync = fs.unlinkSync
//       const originalRenameSync = fs.renameSync

//       // Block file write operations
//       fs.writeFileSync = function(...args: any[]) {
//         console.error('🚫 File write blocked in production:', args[0])
//         throw new Error('File writes are not allowed in production mode. Files must be uploaded to the API backend.')
//       }

//       fs.writeFile = function(...args: any[]) {
//         console.error('🚫 File write blocked in production:', args[0])
//         const callback = args[args.length - 1]
//         if (typeof callback === 'function') {
//           callback(new Error('File writes are not allowed in production mode'))
//         }
//         return
//       }

//       // Block directory creation
//       fs.mkdirSync = function(...args: any[]) {
//         console.error('🚫 Directory creation blocked in production:', args[0])
//         throw new Error('Directory creation is not allowed in production mode')
//       }

//       // Block file deletion
//       fs.unlinkSync = function(...args: any[]) {
//         console.error('🚫 File deletion blocked in production:', args[0])
//         throw new Error('File deletion is not allowed in production mode')
//       }

//       // Block file renaming
//       fs.renameSync = function(...args: any[]) {
//         console.error('🚫 File rename blocked in production:', args[0], '->', args[1])
//         throw new Error('File renaming is not allowed in production mode')
//       }
//     } catch (error) {
//       // If fs module is not available, that's fine
//       console.warn('File protection: fs module not available (this is normal in some environments)')
//     }
//   }
// }

// // Call on module load
// protectFileSystem()
