"use client"
import React, { useEffect, useState } from 'react';
import {
  Search,
  Mail,
  UserPlus,
  Phone,
  Trash2,
} from 'lucide-react';
import { NewSupportUserForm } from '@/components/feature/Support/NewSupportUserForm'; 
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Overlay from '@/components/Overlay';
import { AllRole, FormValues, ICreateUserParam, IUser, ManagerRole, SeachUserParams } from '@/types/user';
import { PROFILE_MANAGER } from '@/constant';
import { createUser, searchUser } from '@/actions/userAction';
import { getRoleBadge } from '@/lib/utils-component';
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable';
import Nodata from '@/components/error/Nodata';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SuccessModal } from '@/components/Modal/SucessModal';
import Loading from '@/components/error/Loading';




const SupportUsers = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [selectedRole, setSelectedRole] = useState<AllRole>('ALL');
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {

    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      setIsFetchingUser(true);
      const payload: SeachUserParams = {
        orderBy: "U.NIU",
        term: "",
        orderMode: 'desc',
        offset: 0,
        limit: 1000,
        page: 1,
      } 

      const result = await searchUser(payload);
      if(result.data){
        const _userList: IUser[] = result.data.body.items.length > 0 ?
        result.data.body.items.filter((_user:any) =>(_user.RoleCode == 'ADMIN' || _user.RoleCode == 'SUPPORT'))
        .map((_user:any) => ({
          id: _user.Code,
          firstName: _user.user.Firstname,
          lastName: _user.user.Lastname,
          email: _user.user.Email,
          phone: _user.user.Phone,
          profile: [_user.RoleCode],
          gender: _user.user.Gender,
          city: _user.user.Address.City,
          street: _user.user.Address.Street,
          country: _user.user.Address.Country,
          avatarUrl: _user.user.AvatarUrl,
          status: _user.user.Status,
          NIU: _user.user.NIU,
        })) : [];
        console.log('-->result.data.body.items', result.data.body.items);
        setUserList(_userList);
      } else if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log('SupportUsers.getUserList.error', error);
      toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
    } finally {
      setIsFetchingUser(false);
    }
    

  }

  
  const filteredUsers = userList.filter((user) => selectedRole === 'ALL' || user.profile.includes(selectedRole))
  
  const usersTableColumn = [
    {
      key: 'userId',
      label: 'USER',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
          <div className="text-gray-800 text-sm dark:text-gray-100">
            <div className="font-bold">{user.lastName} {user.firstName}</div>
            <div>NUI : {user.NIU}</div>
          </div>
      ),
    },
    {
      key: 'contact',
      label: 'CONTACT',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
      <div className="text-sm sm:text-base text-gray-800 dark:text-gray-100">
        <div className="flex flex-row flex-nowrap items-center gap-2 sm:justify-start justify-end">
          <Mail size={14} /> {user.email}
        </div>
        <div className="flex flex-row flex-nowrap items-center gap-2 sm:justify-start justify-end">
          <Phone size={14} /> {user.phone}
        </div>
      </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
      <div className="text-sm text-gray-800 dark:text-gray-100">
        {getRoleBadge(user.profile[0])}
      </div>
      ),
    },
    {
        key: 'actions',
        label: 'Actions',
        priority: "high" as "high",
        render: (_: any, user: IUser) => (
            <button 
              onClick={(e) => {e.stopPropagation(); handleDeleteUser(user);}}
              className="px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200 
              bg-blue-100 text-blue-800 hover:bg-blue-200 active:bg-blue-300 
              dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 dark:active:bg-blue-700"
            >
              <Trash2 size={14}/>
            </button>

        ),
    },
  ]

  const handleDeleteUser = async (user: IUser) => {
    console.log("-->user", user);
  }


  const handleSelectUSer = (userId: string) => {
    console.log('handleSelectUSer.userId', userId);
  }
  const handleNewUserSubmit = async (data: FormValues) => {
    console.log('New support user data:', data.country)
    try {
      const payload: ICreateUserParam = {
        "email": data.email,
        "phone": data.phone,
        "gender": data.gender,
        "lastname": data.lastName,
        "firstname":data.firstName,
        "password": data.password,
        "role": data.role,
        "addressData": {
          city: data.city,
          street: data.street,
          country: data.country
        }
      }
      const result = await createUser(payload);

      if(result?.data){
        setSuccessMessage("Admin created successfully");
        setShowSuccessModal(true)
      } else if (result?.error) {
        console.log('SupportUser.handleNewUser.result.error', result.error);
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log("SupportUser.handleNewUser.error", error);
      toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
    } finally {
      if(showSuccessModal){
        await getUserList();
      }
      setShowNewUserForm(false);
    }
    

    
  };


  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Support User" />

        <div className="w-full">
          <div className="flex justify-end items-center mb-6">
            <button onClick={() => setShowNewUserForm(true)} className="bg-[#2A4365] text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <UserPlus size={20} />
              Add Support User
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
            >
              <option value="all">All Roles</option>
              {PROFILE_MANAGER.map(profile => (
                <option key={profile.value} value={profile.value}>{profile.label}</option>
              ))}
            </select>
          </div>


          <div className="bg-transparent md:bg-white md:dark:bg-gray-800 rounded-lg md:shadow-sm overflow-hidden">
            {
              !isFetchingUser ? 
                userList.length > 0 && isFetchingUser == false ? (
                  <ResponsiveTable
                    columns={usersTableColumn}
                    data={userList.slice(0, 100)}
                    onRowClick={(user: IUser) => handleSelectUSer(user.id)}
                    keyField="id"
                    paginate={10}
                  />
                  ) : (
                  <Nodata message="No user to display" />
                )
                : 
              <Loading />
            }
          </div>
          


          <Overlay isOpen={showNewUserForm} onClose={() => setShowNewUserForm(false)}>
            <NewSupportUserForm
                isOpen={showNewUserForm}
                onClose={() => setShowNewUserForm(false)}
                onSubmit={handleNewUserSubmit}
              />
          </Overlay>
          <Overlay isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
            <SuccessModal
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />
          </Overlay>
        </div>
    </DefaultLayout>
  )
}

export default SupportUsers;
