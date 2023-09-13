import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, CloseButton, useDisclosure } from "@chakra-ui/react"
import { AlertStatus } from "@chakra-ui/react"

type AlertType = {
    status: AlertStatus
    title: string
    description: string
    isVisible: boolean
    onClose: () => void
}

export function AlertStyled({status, title, description, isVisible, onClose}: AlertType) {

  
    return (      
<>

    {isVisible && (    
    <Alert status={status}>
        <AlertIcon />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
        {description}
          </AlertDescription>
        </Box>
        <CloseButton
          alignSelf='flex-start'
          position='relative'
          right={-1}
          top={-1}
          onClick={onClose}
        />
      </Alert>
      )}
</>
      
)

  
  }