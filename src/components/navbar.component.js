import React, { useState } from "react";
import { ExitToApp } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import {
    Button,
    AppBar,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemIcon,
    Menu,
    MenuItem,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import logo from "../fire.svg";
const UserList = ({ users }) => {
    return (
        <List className='p-1'>
            <Typography variant='h6' className='align-center'>
                Users
            </Typography>
            {users.map((user) => (
                <ListItem
                    className={`${"row"}`}
                    alignItems='flex-start'
                    key={user.uid}>
                    <ListItemAvatar className='my-auto'>
                        <Avatar size='small' src={user.photoURL} alt='' />
                    </ListItemAvatar>
                    <ListItemText
                        primary={user.displayName}
                        className='w-max my-auto font-open'
                    />
                </ListItem>
            ))}
        </List>
    );
};
const Navbar = ({ user, users, auth }) => {
    const [isOpen, setOpen] = useState(false);
    const toggleDrawer = () => {
        setOpen(!isOpen);
    };

    return (
        <AppBar position='fixed' color='primary'>
            <Toolbar>
                {user && (
                    <React.Fragment key={"left"}>
                        <IconButton
                            edge='start'
                            variant='temporary'
                            // className={classes.menuButton}
                            onClick={toggleDrawer}
                            color='inherit'
                            aria-label='menu'>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor={"left"}
                            open={isOpen}
                            onClose={toggleDrawer}>
                            <UserList users={users} />
                        </Drawer>
                    </React.Fragment>
                )}
                <img src={logo} style={{ height: "1.5rem" }} />
                <Typography
                    variant='h6'
                    className='f-grow-1 align-left font-raleway ml-2'>
                    ReactChat
                </Typography>
                {user ? (
                    <SignOut auth={auth} />
                ) : (
                    <Button
                        color='inherit'
                        size='small'
                        href='http://sparshjain.me'
                        target='_blank'>
                        {"</> with 🧡 by Sparsh"}
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};
const StyledMenu = withStyles({
    paper: {
        // border: "1px solid #d3d4d5",
        background: "#0f4c75",
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));
const StyledMenuItem = withStyles((theme) => ({
    root: {
        "&:focus": {
            backgroundColor: theme.palette.primary.main,
            "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);
const emojiArray = ["👨🏻", "👦🏻", "👩🏻‍🦰", "🧔🏻", "👳🏻‍♂️", "👸🏻", "👨🏻‍🦱", "👦🏽", "🧔🏽"];
const SignOut = ({ auth }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        auth.currentUser && (
            <div>
                <Button
                    color='secondary'
                    variant='contained'
                    onClick={handleClick}>
                    {`${
                        emojiArray[
                            Math.floor(Math.random() * emojiArray.length)
                        ]
                    } ${auth.currentUser.displayName}`}
                </Button>
                <StyledMenu
                    id='customized-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    <MenuItem
                        onClick={() => auth.signOut()}
                        className='align-center'>
                        <ListItemText primary='Sign Out ' />
                        <ListItemIcon>
                            <ExitToApp fontSize='small' />
                        </ListItemIcon>
                    </MenuItem>
                </StyledMenu>
            </div>
        )
    );
};
export default Navbar;
